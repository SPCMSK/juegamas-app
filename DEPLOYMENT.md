# Environment Variables for Vercel Deployment

## Required Environment Variables:

Add these variables in your Vercel project settings:

```
VITE_SUPABASE_URL=https://dadwdliojygiminsoyaw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZHdkbGlvanlnaW1pbnNveWF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNzEyNjYsImV4cCI6MjA2OTY0NzI2Nn0.jQ3btJEVh7ndzsos_wd8LJft9l2yB7eQ4QH0EvePPeU
```

## How to add in Vercel:

1. Go to your Vercel project dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables" in the sidebar
4. Add each variable with name and value
5. Make sure to set them for Production, Preview, and Development environments
6. Redeploy your project

## Dependencies Fixed:

- Downgraded `date-fns` from v4.1.0 to v3.6.0 for compatibility with `react-day-picker`
- Fixed environment variable formatting (removed spaces after =)
