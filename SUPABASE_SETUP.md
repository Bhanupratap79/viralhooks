# Supabase Setup for ViralHooks

## 1. Create a Supabase Account
- Go to https://supabase.com and sign up (free tier)
- Create a new project (name: `viralhooks`, choose a strong password)

## 2. Get Your API Keys
- In your project dashboard, go to **Project Settings > API**
- Copy the `Project URL` and `anon public key`

## 3. Create `.env` File
In the project root (`C:\Users\bhawa\viralhooks`), create a file called `.env`:

```
VITE_SUPABASE_URL=https://your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. Run This SQL in Supabase SQL Editor
Go to **SQL Editor** in Supabase and run:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  display_name TEXT,
  role TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Allow admins to read all profiles
CREATE POLICY "Admins can read all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow admins to update profiles
CREATE POLICY "Admins can update profiles"
  ON profiles FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'free');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function on user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

## 5. Enable Google Auth
- In Supabase, go to **Authentication > Providers**
- Enable Google
- Follow the instructions to set up Google OAuth credentials

## 6. Enable Email Auth
- In Supabase, go to **Authentication > Providers**
- Email is enabled by default
- For production, go to **Authentication > Settings** and enable "Confirm email" for email/password signup

## 7. Rebuild & Deploy
After setting up `.env`:

```powershell
$env:GITHUB_PAGES='true'; npm run build
cd dist; git add -A; git commit -m "Update with Supabase keys"
git push origin gh-pages
```

## 8. Set the First Admin
After your first signup, run this in Supabase SQL Editor:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your-email@gmail.com';
```

Then you'll see the Admin Panel link in your dashboard.
