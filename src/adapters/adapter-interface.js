/**
 * Shared contract every platform adapter must implement. Instagram and
 * Facebook are the first two; LinkedIn / Google Business Profile can plug
 * in later by adding a new file here and registering it in ./index.js —
 * nothing else in the publishing pipeline needs to change.
 *
 * @typedef {Object} PublishPost
 * @property {string} id            content_queue.id
 * @property {string} caption
 * @property {string} [hashtags]
 * @property {string} imageUrl      publicly reachable image URL (Graph API fetches it directly)
 *
 * @typedef {Object} PublishResult
 * @property {string} externalId    platform-assigned post/media id
 * @property {string} [permalink]
 *
 * @typedef {Object} Adapter
 * @property {string} platform      matches the publish_platform enum value
 * @property {(post: PublishPost) => Promise<PublishResult>} publish
 */

/**
 * Throw this from an adapter for errors the scheduler should retry
 * (rate limits, transient network/5xx). Anything else is treated as a
 * permanent failure and won't be retried automatically.
 */
export class RetryableAdapterError extends Error {}
