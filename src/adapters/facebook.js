import { RetryableAdapterError } from './adapter-interface.js';

const GRAPH_VERSION = 'v21.0';

/**
 * Posts a photo + caption to a Facebook Page via the Graph API.
 * Credentials come from env vars only — never hardcode or log tokens.
 *
 * Required env:
 *   FACEBOOK_PAGE_ID
 *   FACEBOOK_PAGE_ACCESS_TOKEN   long-lived Page access token
 *
 * @type {import('./adapter-interface.js').Adapter}
 */
export const facebookAdapter = {
  platform: 'facebook',

  async publish(post) {
    const pageId = process.env.FACEBOOK_PAGE_ID;
    const token = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    if (!pageId || !token) {
      throw new Error('Missing FACEBOOK_PAGE_ID or FACEBOOK_PAGE_ACCESS_TOKEN env vars');
    }
    if (!post.imageUrl) {
      throw new Error(`Post ${post.id} has no imageUrl — cannot publish to Facebook`);
    }

    const message = post.hashtags ? `${post.caption}\n\n${post.hashtags}` : post.caption;

    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${pageId}/photos`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: post.imageUrl,
          caption: message,
          access_token: token,
        }),
      }
    );

    const body = await res.json();

    if (!res.ok) {
      const err = body?.error;
      const isRetryable = res.status === 429 || res.status >= 500;
      const message = err?.message || `Facebook publish failed (${res.status})`;
      if (isRetryable) throw new RetryableAdapterError(message);
      throw new Error(message);
    }

    return {
      externalId: body.post_id || body.id,
      permalink: body.post_id
        ? `https://www.facebook.com/${body.post_id}`
        : undefined,
    };
  },
};
