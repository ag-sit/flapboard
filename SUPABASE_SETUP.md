# Supabase Setup Instructions

This document provides instructions for setting up Supabase authentication for the MTA Service Alerts application.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A Supabase project created

## Environment Variables

Make sure you have the following environment variables set in your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

You can find these values in your Supabase project settings under "API".

## Supabase Configuration

### 1. Authentication Setup

The application uses Supabase Auth for user authentication. No additional SQL setup is required for basic authentication - Supabase handles user management automatically.

#### Email Authentication (Default)

Email authentication is enabled by default in Supabase. Users can:
- Sign up with email and password
- Sign in with email and password
- Reset their password via the forgot password flow

#### Optional: Enable Additional Auth Providers

If you want to enable social authentication (Google, GitHub, etc.):

1. Go to your Supabase Dashboard
2. Navigate to Authentication > Providers
3. Enable the providers you want (e.g., Google, GitHub)
4. Configure the OAuth credentials for each provider

### 2. Database Schema (Optional)

Currently, the application uses mock data for MTA alerts. If you want to store alerts in Supabase, you would need to create a table. However, **this is not required** for the current implementation.

#### Optional: Create Alerts Table

If you want to store alerts in the database, run this SQL in your Supabase SQL Editor:

```sql
-- Create alerts table
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line TEXT NOT NULL,
  line_color TEXT NOT NULL,
  line_type TEXT NOT NULL CHECK (line_type IN ('subway', 'rail')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  affected_stations TEXT[] DEFAULT '{}',
  severity TEXT NOT NULL CHECK (severity IN ('minor', 'moderate', 'major', 'planned')),
  expected_resolution TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_alerts_line_type ON alerts(line_type);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_last_updated ON alerts(last_updated DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all users to read alerts (public data)
CREATE POLICY "Allow public read access to alerts"
  ON alerts FOR SELECT
  USING (true);

-- If you want authenticated users to be able to create/update alerts:
-- CREATE POLICY "Allow authenticated users to insert alerts"
--   ON alerts FOR INSERT
--   WITH CHECK (auth.role() = 'authenticated');
--
-- CREATE POLICY "Allow authenticated users to update alerts"
--   ON alerts FOR UPDATE
--   USING (auth.role() = 'authenticated');
```

### 3. User Profiles (Optional)

If you want to store additional user profile information, you can create a profiles table:

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create a trigger to automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## Testing Authentication

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000`
3. Click "Sign up" to create a new account
4. Check your email for the confirmation link (if email confirmation is enabled)
5. Sign in with your credentials

## Email Configuration

### Development

For local development, Supabase provides a test email service. Check your Supabase Dashboard > Authentication > Email Templates to see test emails.

### Production

For production, configure a custom SMTP server:

1. Go to Supabase Dashboard > Project Settings > Auth
2. Scroll to "SMTP Settings"
3. Configure your SMTP server (e.g., SendGrid, Mailgun, AWS SES)
4. Update email templates if needed

## Security Notes

- The application uses Row Level Security (RLS) policies to secure data
- Never expose your Supabase service role key in client-side code
- Always use the `anon` key for client-side operations
- Use environment variables to store sensitive keys

## Troubleshooting

### "Invalid API key" error
- Verify your environment variables are set correctly
- Check that you're using the `anon` key, not the `service_role` key

### Authentication not working
- Check that Authentication is enabled in your Supabase project
- Verify email confirmation settings in Authentication > Settings
- Check browser console for detailed error messages

### Users can't sign up
- Check Supabase Dashboard > Authentication > Settings
- Verify that email signup is enabled
- Check if email confirmation is required and if emails are being sent

## Next Steps

1. Set up your environment variables
2. Test the authentication flow
3. (Optional) Set up the database schema if you want to store alerts
4. (Optional) Configure custom email templates
5. Deploy to Vercel or your preferred hosting platform

## Additional Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js with Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

