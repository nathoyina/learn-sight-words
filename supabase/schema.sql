create extension if not exists pgcrypto;

create table if not exists public.teachers (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references public.teachers(id) on delete cascade,
  name text not null,
  code text not null unique,
  allow_self_join boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.students (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.classes(id) on delete cascade,
  name text not null,
  pin_hash text not null,
  progress jsonb not null default '{}'::jsonb,
  last_seen_at timestamptz,
  created_at timestamptz not null default now()
);

create unique index if not exists students_unique_name_per_class
  on public.students (class_id, lower(name));

alter table public.teachers enable row level security;
alter table public.classes enable row level security;
alter table public.students enable row level security;

drop policy if exists "teachers_own_row" on public.teachers;
create policy "teachers_own_row"
  on public.teachers
  for all
  using (id = auth.uid())
  with check (id = auth.uid());

drop policy if exists "teachers_manage_classes" on public.classes;
create policy "teachers_manage_classes"
  on public.classes
  for all
  using (teacher_id = auth.uid())
  with check (teacher_id = auth.uid());

drop policy if exists "teachers_manage_students" on public.students;
create policy "teachers_manage_students"
  on public.students
  for all
  using (
    exists (
      select 1 from public.classes c
      where c.id = class_id and c.teacher_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.classes c
      where c.id = class_id and c.teacher_id = auth.uid()
    )
  );

create or replace function public.kid_login(class_code text, student_name text, pin text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  target_student public.students%rowtype;
begin
  select s.* into target_student
  from public.students s
  join public.classes c on c.id = s.class_id
  where lower(c.code) = lower(class_code)
    and lower(s.name) = lower(student_name)
  limit 1;

  if target_student.id is null then
    raise exception 'invalid_login';
  end if;

  if extensions.crypt(pin, target_student.pin_hash) <> target_student.pin_hash then
    raise exception 'invalid_login';
  end if;

  update public.students
  set last_seen_at = now()
  where id = target_student.id;

  return target_student.id;
end;
$$;

grant execute on function public.kid_login(text, text, text) to anon, authenticated;

create or replace function public.kid_self_join(class_code text, student_name text, pin text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  target_class_id uuid;
  allow_join boolean;
  student_id uuid;
begin
  select id, allow_self_join into target_class_id, allow_join
  from public.classes
  where lower(code) = lower(class_code)
  limit 1;

  if target_class_id is null then
    raise exception 'class_not_found';
  end if;

  if not allow_join then
    raise exception 'self_join_disabled';
  end if;

  insert into public.students (class_id, name, pin_hash, progress, last_seen_at)
  values (
    target_class_id,
    trim(student_name),
    extensions.crypt(pin, extensions.gen_salt('bf')),
    '{}'::jsonb,
    now()
  )
  returning id into student_id;

  return student_id;
exception
  when unique_violation then
    raise exception 'name_taken';
end;
$$;

grant execute on function public.kid_self_join(text, text, text) to anon, authenticated;

create or replace function public.kid_get_progress(student_id uuid, pin text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  target_student public.students%rowtype;
begin
  select * into target_student
  from public.students
  where id = student_id
  limit 1;

  if target_student.id is null then
    raise exception 'student_not_found';
  end if;

  if extensions.crypt(pin, target_student.pin_hash) <> target_student.pin_hash then
    raise exception 'invalid_login';
  end if;

  return coalesce(target_student.progress, '{}'::jsonb);
end;
$$;

grant execute on function public.kid_get_progress(uuid, text) to anon, authenticated;

create or replace function public.kid_update_progress(student_id uuid, pin text, new_progress jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_student public.students%rowtype;
begin
  select * into target_student
  from public.students
  where id = student_id
  limit 1;

  if target_student.id is null then
    raise exception 'student_not_found';
  end if;

  if extensions.crypt(pin, target_student.pin_hash) <> target_student.pin_hash then
    raise exception 'invalid_login';
  end if;

  update public.students
  set progress = coalesce(new_progress, '{}'::jsonb),
      last_seen_at = now()
  where id = student_id;
end;
$$;

grant execute on function public.kid_update_progress(uuid, text, jsonb) to anon, authenticated;

create or replace function public.teacher_reset_pin(student_id uuid, new_pin text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  class_owner uuid;
begin
  select c.teacher_id into class_owner
  from public.students s
  join public.classes c on c.id = s.class_id
  where s.id = student_id
  limit 1;

  if class_owner is null then
    raise exception 'student_not_found';
  end if;

  if class_owner <> auth.uid() then
    raise exception 'not_authorized';
  end if;

  update public.students
  set pin_hash = extensions.crypt(new_pin, extensions.gen_salt('bf'))
  where id = student_id;
end;
$$;

grant execute on function public.teacher_reset_pin(uuid, text) to authenticated;
