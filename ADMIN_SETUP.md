# Admin Dashboard Setup

This document explains how to set up and access the admin dashboard.

## Making Your First Admin User

When you first deploy the application, you'll need to manually set an admin role for your user through Clerk's dashboard.

### Method 1: Using Clerk Dashboard (Recommended)

1. Go to your Clerk Dashboard: https://dashboard.clerk.com
2. Select your application
3. Navigate to **Users** section
4. Find your user account
5. Click on the user to open details
6. Scroll to **Public Metadata** section
7. Click **Edit**
8. Add the following JSON:
   ```json
   {
     "role": "admin"
   }
   ```
9. Click **Save**

### Method 2: Using Clerk API

You can also use Clerk's API to set the role:

```bash
curl -X PATCH https://api.clerk.com/v1/users/USER_ID \
  -H "Authorization: Bearer YOUR_CLERK_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{"public_metadata": {"role": "admin"}}'
```

Replace `USER_ID` with your Clerk user ID and `YOUR_CLERK_SECRET_KEY` with your Clerk secret key from `.env`.

## Accessing the Admin Dashboard

Once you have admin role assigned:

1. Sign in to your account
2. Navigate to `/admin` in your browser
3. You should see the admin dashboard

If you don't have admin role, you'll be redirected to the home page.

## User Roles

The platform supports three role levels:

- **user**: Regular users (default)
- **moderator**: Can moderate content but has limited admin access
- **admin**: Full access to all admin features

## Admin Dashboard Features

### Dashboard Overview (`/admin`)
- Total users count
- Total properties stats
- Favorites statistics
- Average property price
- Recent properties list

### User Management (`/admin/users`)
- View all registered users
- Change user roles (user, moderator, admin)
- View user activity (created date, last sign in)
- See user status (active/banned)

### Property Management (`/admin/properties`)
- View all properties on the platform
- Edit any property
- Delete properties
- View property details

### Analytics (`/admin/analytics`)
- Placeholder for future analytics features

### Settings (`/admin/settings`)
- Placeholder for platform configuration options

## Security Notes

- Only users with `admin` role can access the admin dashboard
- Role checks are performed server-side for security
- All admin API routes verify admin status before processing
- Unauthorized access attempts redirect to home page

## Troubleshooting

**I can't access /admin**
- Make sure you've set the `role: "admin"` in your user's public metadata
- Sign out and sign back in after changing roles
- Check browser console for any errors

**Role changes aren't taking effect**
- Clear browser cookies and sign in again
- Verify the role is correctly set in Clerk dashboard
- Check that your Clerk secret key is correct in `.env`

**Users list is empty**
- Ensure Clerk is properly configured
- Check that `CLERK_SECRET_KEY` is set in `.env`
- Verify network access to Clerk API

## Development

To add new admin features:

1. Create page in `src/app/admin/[feature]/page.tsx`
2. Add navigation link in `src/components/admin/AdminLayout.tsx`
3. Add admin check: `const adminCheck = await isAdmin()`
4. Create any necessary API routes in `src/app/api/admin/...`

All admin routes should be protected with the `isAdmin()` check.
