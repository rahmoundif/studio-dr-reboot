create table public.mail_queue (
  id uuid not null default gen_random_uuid (),
  profile_id uuid null,
  recipient text not null,
  subject text null,
  html text null,
  type text null,
  payload jsonb null,
  status text null default 'pending'::text,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint mail_queue_pkey primary key (id),
  constraint mail_queue_profile_id_fkey foreign KEY (profile_id) references profiles (id) on delete set null
) TABLESPACE pg_default;

create index IF not exists idx_mail_queue_status_created on public.mail_queue using btree (status, created_at) TABLESPACE pg_default;

create table public.profiles (
  id uuid not null,
  email text null,
  full_name text null,
  is_approved boolean not null default false,
  created_at timestamp with time zone null default now(),
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_profiles_is_approved on public.profiles using btree (is_approved) TABLESPACE pg_default;

create trigger notify_admin_on_profile_insert
after INSERT on profiles for EACH row
execute FUNCTION enqueue_new_user_notify ();