-- Cool Beans publishing queue schema
-- Apply with: supabase db push  (or via the Supabase MCP apply_migration tool)
-- once a Supabase project exists for this repo.

create type post_status as enum (
  'draft',
  'approved',
  'scheduled',
  'publishing',
  'published',
  'failed'
);

create type publish_platform as enum (
  'instagram',
  'facebook'
);

create table if not exists content_queue (
  id uuid primary key default gen_random_uuid(),
  post_num integer,                -- links back to the legacy data/posts.json "num" when seeded
  product text,
  category text,
  title text,
  caption text not null,
  hashtags text,
  image_url text,                  -- final graphic URL (Canva export or generated asset)
  image_prompt text,
  platforms publish_platform[] not null default '{}',
  status post_status not null default 'draft',
  scheduled_at timestamptz,        -- when it should go out
  published_at timestamptz,
  retry_count integer not null default 0,
  max_retries integer not null default 3,
  next_attempt_at timestamptz,     -- retry backoff pointer; scheduler polls on this
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_queue_status_idx on content_queue (status);
create index if not exists content_queue_scheduled_at_idx on content_queue (scheduled_at);
create index if not exists content_queue_next_attempt_at_idx on content_queue (next_attempt_at);

create table if not exists publish_log (
  id uuid primary key default gen_random_uuid(),
  content_queue_id uuid not null references content_queue(id) on delete cascade,
  platform publish_platform not null,
  attempt_num integer not null,
  status text not null,            -- 'success' | 'failed'
  external_id text,                -- platform post/media id on success
  permalink text,
  error text,
  triggered_by text not null default 'scheduler', -- 'scheduler' | 'publish-now'
  created_at timestamptz not null default now()
);

create index if not exists publish_log_content_queue_id_idx on publish_log (content_queue_id);

-- keep updated_at current
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists content_queue_set_updated_at on content_queue;
create trigger content_queue_set_updated_at
  before update on content_queue
  for each row execute function set_updated_at();

-- RLS: service role (used only from Netlify Functions) bypasses RLS by default.
-- Enable RLS and allow the dashboard's anon/publishable key read-only access;
-- all writes go through the Netlify Functions using the service role key.
alter table content_queue enable row level security;
alter table publish_log enable row level security;

create policy "public read content_queue" on content_queue
  for select using (true);

create policy "public read publish_log" on publish_log
  for select using (true);
