# Supabase Setup Guide for AquaMind

## Prerequisites
- A Supabase account (free at [supabase.com](https://supabase.com))

## Setup Steps

### 1. Create a New Supabase Project
1. Go to [app.supabase.com](https://app.supabase.com)
2. Click "New project"
3. Choose your organization
4. Enter project details:
   - **Name**: AquaMind
   - **Database Password**: Generate a strong password and save it
   - **Region**: Choose closest to your location
5. Click "Create new project"
6. Wait for the project to be created (usually 1-2 minutes)

### 2. Get Your Project Credentials
1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

### 3. Configure Your Environment
1. In your AquaMind project root, create a `.env.local` file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your_project_url_here
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   ```

### 4. Set Up the Database Schema
1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `scripts/setup-database.sql`
3. Paste it into the SQL editor
4. Click "Run" to execute the script

This will create:
- All necessary tables (profiles, tanks, fish, water_parameters)
- Row Level Security (RLS) policies
- Database functions and triggers
- Custom types and constraints

### 5. Verify the Setup
1. Go to **Table Editor** in your Supabase dashboard
2. You should see the following tables:
   - `profiles`
   - `tanks`
   - `fish`
   - `water_parameters`

### 6. Test Authentication (Optional)
1. Go to **Authentication** > **Settings**
2. Configure your email templates and settings as needed
3. Test user registration and login in your app

## Security Features
- **Row Level Security (RLS)**: All tables have RLS enabled
- **User Isolation**: Users can only access their own data
- **Secure Storage**: Session tokens are stored securely using Expo SecureStore

## Next Steps
After completing this setup:
1. Restart your Expo development server
2. Test user registration and login
3. Verify that authentication redirects work properly
4. Start adding tank and fish management features

## Troubleshooting

### Environment Variables Not Loading
- Make sure `.env.local` is in your project root
- Restart the Expo development server
- Check that variable names start with `EXPO_PUBLIC_`

### Database Connection Issues
- Verify your project URL and API key are correct
- Check that the database schema was created successfully
- Ensure RLS policies are enabled

### Authentication Issues
- Check Supabase Auth settings
- Verify email templates are configured
- Check browser console for error messages

For more help, visit the [Supabase Documentation](https://supabase.com/docs).
