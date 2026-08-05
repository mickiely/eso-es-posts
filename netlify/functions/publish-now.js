import { getSupabaseAdmin } from '../../src/lib/supabase-admin.js';
import { claimPost, processPost } from '../../src/lib/queue.js';

// Manual trigger, called from the dashboard's "Publish Now" button.
// Protected by a shared secret so the endpoint can't be used to spam
// Facebook/Instagram from an arbitrary POST — set DASHBOARD_API_SECRET
// in Netlify env vars and have the dashboard send it as a header.
export const config = { path: '/api/publish-now' };

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const expected = process.env.DASHBOARD_API_SECRET;
  const provided = req.headers.get('x-dashboard-secret');
  if (expected && provided !== expected) {
    return new Response('Unauthorized', { status: 401 });
  }

  let postId;
  try {
    ({ postId } = await req.json());
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }
  if (!postId) {
    return new Response(JSON.stringify({ error: 'postId is required' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const supabase = getSupabaseAdmin();
  const claimed = await claimPost(supabase, postId);
  if (!claimed) {
    return new Response(
      JSON.stringify({ error: 'Post not found, or already publishing/published' }),
      { status: 409, headers: { 'content-type': 'application/json' } }
    );
  }

  try {
    const result = await processPost(supabase, claimed, 'publish-now');
    return new Response(JSON.stringify(result), {
      headers: { 'content-type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
