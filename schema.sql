create table public.users (
  id uuid not null,
  firstname text not null,
  lastname text not null,
  bio text null,
  avatar_url text null,
  role text not null default 'developer'::text,
  is_public boolean not null default true,
  is_approved boolean not null default false,
  pseudo text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  onboarded boolean null default false,
  first_login_at timestamp with time zone null,
  status text null,
  constraint users_pkey primary key (id),
  constraint users_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE,
  constraint users_pseudo_not_empty check (
    (
      (pseudo is null)
      or (
        length(
          TRIM(
            both
            from
              pseudo
          )
        ) > 0
      )
    )
  )

  create table public.settings (
  id uuid not null default gen_random_uuid (),
  site_name text null default 'Studio DR'::text,
  language_default text null default 'fr'::text,
  maintenance_mode boolean null default false,
  logo_url text null,
  constraint settings_pkey primary key (id)
) TABLESPACE pg_default;

create table public.offers (
  id uuid not null default gen_random_uuid (),
  price_ht numeric(10, 2) null,
  is_active boolean null default true,
  display_order integer null default 0,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint offers_pkey primary key (id)
) TABLESPACE pg_default;

create table public.content_sections (
  id uuid not null default gen_random_uuid (),
  slug text not null,
  title text null,
  body text null,
  last_modified_by uuid null,
  updated_at timestamp with time zone null default now(),
  constraint content_sections_pkey primary key (id),
  constraint content_sections_slug_key unique (slug)
) TABLESPACE pg_default;

create table public.contact_messages (
  id uuid not null default gen_random_uuid (),
  firstname text null,
  lastname text null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamp with time zone null default now(),
  constraint contact_messages_pkey primary key (id)
) TABLESPACE pg_default;

create table public.workflow_steps (
  id uuid not null default gen_random_uuid (),
  step_number integer null,
  title text null,
  text text null,
  is_active boolean null default true,
  display_order integer null default 0,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint workflow_steps_pkey primary key (id)
) TABLESPACE pg_default;