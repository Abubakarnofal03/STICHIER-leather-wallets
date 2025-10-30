# Leather Wallets Store - Database Setup Instructions

## 📋 Overview
This guide will help you set up an identical database structure for your new leather wallets e-commerce store in Supabase.

## 📦 What's Included

The complete database schema includes:

### Tables (13 total)
1. **user_roles** - User role management (admin/customer)
2. **profiles** - User profile information
3. **categories** - Product categories
4. **products** - Product catalog with full details
5. **product_images** - Multiple images per product
6. **product_variations** - Product variations (sizes, colors, etc.)
7. **orders** - Customer orders (supports guest checkout)
8. **order_items** - Individual items in orders
9. **cart_items** - Shopping cart
10. **banners** - Homepage banners
11. **sales** - Product sales and discounts
12. **blogs** - Blog posts for SEO
13. **reviews** - Product reviews and ratings

### Features
- ✅ Row Level Security (RLS) on all tables
- ✅ Automated triggers for timestamps
- ✅ Admin and customer role management
- ✅ Guest checkout support
- ✅ Product variations support
- ✅ Sales and discount management
- ✅ Product reviews system
- ✅ SEO fields for products, categories, and blogs
- ✅ Storage bucket for images and videos
- ✅ Shopping cart functionality
- ✅ Multiple product images support

### Product Features
- SKU tracking
- Stock management
- Shipping cost
- Weight tracking
- Video support
- SEO meta fields
- Featured products flag
- Multiple images per product

### Order Features
- Guest checkout
- User orders
- Order status tracking
- Admin notes
- Customer confirmation
- Courier tracking
- Support for product variations

## 🚀 Setup Steps

### Step 1: Create New Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - **Name**: Leather Wallets Store (or your preferred name)
   - **Database Password**: Choose a strong password
   - **Region**: Select closest to your target audience
4. Wait for project to be created

### Step 2: Run the Database Schema
1. Open your new Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Open the file: `supabase_leather_wallets_schema.sql`
5. Copy the entire contents
6. Paste into the SQL Editor
7. Click **Run** button
8. Wait for execution to complete (should take 5-10 seconds)

### Step 3: Verify Setup
After running the script, verify everything was created:

1. Go to **Table Editor** (left sidebar)
2. You should see all 13 tables listed
3. Go to **Storage** (left sidebar)
4. Verify `store-images` bucket was created

### Step 4: Create First Admin User
1. Go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter email and password
4. After user is created, go to **SQL Editor**
5. Run this query to make them admin:
```sql
INSERT INTO public.user_roles (user_id, role)
VALUES ('PASTE_USER_ID_HERE', 'admin');
```

### Step 5: Get Your Connection Details
1. Go to **Project Settings** → **API**
2. Copy these values for your `.env` file:
   - **Project URL** (supabase URL)
   - **anon/public key** (publishable key)
   - **Project ID**

### Step 6: Update Your Application
Create a new `.env` file for your leather wallets store:
```env
VITE_SUPABASE_PROJECT_ID="your_new_project_id"
VITE_SUPABASE_PUBLISHABLE_KEY="your_new_publishable_key"
VITE_SUPABASE_URL="your_new_supabase_url"
```

## 📊 Database Structure Overview

### Core Tables Relationship
```
users (Supabase Auth)
├── profiles (user info)
├── user_roles (admin/customer)
├── cart_items (shopping cart)
└── orders
    └── order_items

categories
└── products
    ├── product_images
    ├── product_variations
    ├── reviews
    └── sales
```

## 🔐 Security Features

### Row Level Security (RLS)
- All tables have RLS enabled
- Customers can only view/edit their own data
- Admins have full access to all data
- Public can view products, categories, banners (read-only)
- Guest checkout is supported

### Storage Security
- Public read access to images
- Only admins can upload/delete images
- 50MB file size limit
- Restricted to image and video formats

## 🎨 Customization Tips

### For Leather Wallets Store
You may want to add initial categories specific to leather wallets:
```sql
INSERT INTO public.categories (name, slug, description) VALUES
  ('Men''s Leather Wallets', 'mens-leather-wallets', 'Premium leather wallets for men'),
  ('Women''s Leather Wallets', 'womens-leather-wallets', 'Elegant leather wallets for women'),
  ('Bifold Wallets', 'bifold-wallets', 'Classic bifold leather wallets'),
  ('Trifold Wallets', 'trifold-wallets', 'Spacious trifold leather wallets'),
  ('Card Holders', 'card-holders', 'Minimalist leather card holders'),
  ('Money Clips', 'money-clips', 'Sleek leather money clips');
```

## 🔍 Common Queries

### View all tables
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Check RLS policies
```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename;
```

### List all admins
```sql
SELECT u.email, ur.role, ur.created_at
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE ur.role = 'admin';
```

## ⚠️ Important Notes

1. **No Data Included**: This schema only creates the structure. You'll need to add your own:
   - Categories
   - Products
   - Banners
   - Blog posts

2. **Authentication**: The auth system is handled by Supabase. User authentication will work automatically once you configure your app with the new credentials.

3. **Storage**: Remember to configure your storage bucket public URL in your application.

4. **Migrations**: If you make changes to the schema later, consider using Supabase migrations for version control.

5. **Backup**: Always backup your database before making major changes.

## 🆘 Troubleshooting

### Error: "relation already exists"
- This means a table already exists. Drop it first or use a fresh project.

### Error: "permission denied"
- Make sure you're running the script as the project owner.

### Can't create admin user
- Make sure the user exists in auth.users first.
- Check that the user_id is correct (UUID format).

### Storage bucket not working
- Verify RLS policies were created.
- Check that has_role function exists.

## 📞 Next Steps

After database setup:
1. ✅ Add initial categories for leather wallets
2. ✅ Upload product images to storage bucket
3. ✅ Add products with descriptions and prices
4. ✅ Create homepage banners
5. ✅ Configure your frontend app with new credentials
6. ✅ Test admin dashboard functionality
7. ✅ Test customer checkout flow

## 🎉 You're All Set!

Your leather wallets e-commerce database is ready to use. The structure is identical to your original store, just waiting for your leather wallet products!
