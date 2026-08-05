import { RetryableAdapterError } from './adapter-interface.js';

const GRAPH_VERSION = 'v21.0';

async function graphFetch(url, options) {
  const res = await fetch(url, options);
  const body = await res.json();
  if (!res.ok) {
    const err = body?.error;
    const isRetryable = res.status === 429 || res.status >= 500;
    const message = err?.message || `Instagram Graph API error (${res.status})`;
    if (isRetryable) throw new RetryableAdapterError(message);
    throw new Error(message);
  }
  return body;
}

/**
 * Publishes an image + caption to an Instagram Business account.
 * Instagram posting piggybacks on the same Meta Page access token as
 * Facebook — the IG Business Account must be linked to the Facebook Page.
 *
 * Required env:
 *   INSTAGRAM_BUSINESS_ACCOUNT_ID
 *   FACEBOOK_PAGE_ACCESS_TOKEN
 *
 * Publishing is two steps: create a media container, then publish it.
 *
 * @type {import('./adapter-interface.js').Adapter}
 */
export const instagramAdapter = {
  platform: 'instagram',

  async publish(post) {
    const igUserId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
    const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    if (!igUserId || !token) {
      throw new Error('Missing INSTAGRAM_BUSINESS_ACCOUNT_ID or FACEBOOK_PAGE_ACCESS_TOKEN env vars');
    }
    if (!post.imageUrl) {
      throw new Error(`Post ${post.id} has no imageUrl — cannot publish to Instagram`);
    }

    const caption = post.hashtags ? `${post.caption}\n\n${post.hashtags}` : post.caption;

    const container = await graphFetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${igUserId}/media`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: post.imageUrl,
          caption,
          access_token: token,
        }),
      }
    );

    const publishResult = await graphFetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${igUserId}/media_publish`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          creation_id: container.id,
          access_token: token,
        }),
      }
    );

    return {
      externalId: publishResult.id,
      permalink: undefined, // Graph API doesn't return a permalink directly; fetch via GET /{media-id}?fields=permalink if needed
    };
  },
};
