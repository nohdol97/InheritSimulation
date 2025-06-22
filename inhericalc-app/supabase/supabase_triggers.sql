-- This function will be triggered when a new user signs up.
-- It creates a corresponding row in the public.user_profiles table.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_profiles (user_id, email, name, phone, region, agree_terms, agree_privacy, agree_privacy_optional, agree_marketing)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'region',
    (new.raw_user_meta_data->>'agreeTerms')::boolean,
    (new.raw_user_meta_data->>'agreePrivacy')::boolean,
    (new.raw_user_meta_data->>'agreePrivacyOptional')::boolean,
    (new.raw_user_meta_data->>'agreeMarketing')::boolean
  );
  return new;
end;
$$;

-- Trigger to call the function when a new user is created.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Grant usage on the schema to the postgres user
GRANT USAGE ON SCHEMA auth TO postgres;
-- Grant select on the users table to the postgres user
GRANT SELECT ON auth.users TO postgres; 