import { getSupabaseAdmin } from '../../src/lib/supabase-admin.js';
import { fetchDuePosts, claimPost, processPost } from '../../src/lib/queue.js';

// Runs every 15 minutes, matching the cadence of the Make.com scenario
// this replaces. Netlify Scheduled Functions always run in UTC.
export const config = { schedule: '*/15 * * * *' };

export default async () => {
  const supabase = getSupabaseAdmin();
  const duePosts = await fetchDuePosts(supabase);

  const outcomes = [];
  for (const post of duePosts) {
    const claimed = await claimPost(supabase, post.id);
    if (!claimed) continue; // already claimed by a concurrent run

    try {
      const result = await processPost(supabase, claimed, 'scheduler');
      outcomes.push({ id: post.id, ...result });
    } catch (err) {
      outcomes.push({ id: post.id, status: 'error', error: err.message });
    }
  }

  console.log(`scheduled-publish: processed ${outcomes.length} post(s)`, outcomes);
  return new Response(JSON.stringify({ processed: outcomes.length, outcomes }), {
    headers: { 'content-type': 'application/json' },
  });
};
