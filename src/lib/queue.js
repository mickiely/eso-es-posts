import { adapters, RetryableAdapterError } from '../adapters/index.js';

const RETRY_BACKOFF_MINUTES = [5, 15, 60]; // per retry_count

/**
 * Posts due right now: explicitly scheduled and past their time, or
 * previously failed posts whose retry backoff has elapsed and haven't
 * exhausted max_retries.
 */
export async function fetchDuePosts(supabase, limit = 5) {
  const nowIso = new Date().toISOString();

  const { data, error } = await supabase
    .from('content_queue')
    .select('*')
    .or(
      `and(status.eq.scheduled,scheduled_at.lte.${nowIso}),` +
        `and(status.eq.failed,next_attempt_at.lte.${nowIso})`
    )
    .order('scheduled_at', { ascending: true })
    .limit(limit);

  if (error) throw error;
  // filter retry-exhausted rows client-side (retry_count < max_retries)
  return (data || []).filter((p) => p.retry_count < p.max_retries || p.status === 'scheduled');
}

/**
 * Atomically claim a post for processing so the scheduler and a manual
 * "publish now" click can't race and double-publish the same post.
 */
export async function claimPost(supabase, id) {
  const { data, error } = await supabase
    .from('content_queue')
    .update({ status: 'publishing' })
    .in('status', ['scheduled', 'failed', 'approved'])
    .eq('id', id)
    .select()
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows matched (already claimed)
  return data || null;
}

/**
 * Publishes a claimed post to every platform on it, logs each attempt,
 * and moves the post to its terminal status for this run.
 *
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {object} post content_queue row (already claimed / status='publishing')
 * @param {'scheduler'|'publish-now'} triggeredBy
 */
export async function processPost(supabase, post, triggeredBy) {
  const attemptNum = post.retry_count + 1;
  const results = [];
  let hadFailure = false;
  let retryable = true;

  for (const platform of post.platforms || []) {
    const adapter = adapters[platform];
    if (!adapter) {
      hadFailure = true;
      results.push({ platform, status: 'failed', error: `No adapter registered for "${platform}"` });
      continue;
    }

    try {
      const result = await adapter.publish({
        id: post.id,
        caption: post.caption,
        hashtags: post.hashtags,
        imageUrl: post.image_url,
      });
      results.push({ platform, status: 'success', ...result });
    } catch (err) {
      hadFailure = true;
      if (!(err instanceof RetryableAdapterError)) retryable = false;
      results.push({ platform, status: 'failed', error: err.message });
    }
  }

  await supabase.from('publish_log').insert(
    results.map((r) => ({
      content_queue_id: post.id,
      platform: r.platform,
      attempt_num: attemptNum,
      status: r.status,
      external_id: r.externalId ?? null,
      permalink: r.permalink ?? null,
      error: r.error ?? null,
      triggered_by: triggeredBy,
    }))
  );

  if (!hadFailure) {
    await supabase
      .from('content_queue')
      .update({ status: 'published', published_at: new Date().toISOString(), last_error: null })
      .eq('id', post.id);
    return { status: 'published', results };
  }

  const nextRetryCount = post.retry_count + 1;
  const exhausted = !retryable || nextRetryCount >= post.max_retries;
  const lastError = results.filter((r) => r.status === 'failed').map((r) => `${r.platform}: ${r.error}`).join('; ');

  if (exhausted) {
    await supabase
      .from('content_queue')
      .update({ status: 'failed', retry_count: nextRetryCount, next_attempt_at: null, last_error: lastError })
      .eq('id', post.id);
    return { status: 'failed', results };
  }

  const backoffMinutes = RETRY_BACKOFF_MINUTES[Math.min(post.retry_count, RETRY_BACKOFF_MINUTES.length - 1)];
  const nextAttemptAt = new Date(Date.now() + backoffMinutes * 60_000).toISOString();

  await supabase
    .from('content_queue')
    .update({ status: 'failed', retry_count: nextRetryCount, next_attempt_at: nextAttemptAt, last_error: lastError })
    .eq('id', post.id);

  return { status: 'failed', willRetryAt: nextAttemptAt, results };
}
