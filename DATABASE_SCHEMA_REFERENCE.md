# Database Schema Reference - Leather Wallets Store

## Quick Reference Guide

### Table: user_roles
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| user_id | UUID | FOREIGN KEY → auth.users(id), NOT NULL |
| role | app_role | NOT NULL, DEFAULT 'customer' |
| created_at | TIMESTAMP | DEFAULT NOW() |

**Unique Constraint**: (user_id, role)

---

### Table: profiles
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, FOREIGN KEY → auth.users(id) |
| full_name | TEXT | |
| email | TEXT | |
| phone | TEXT | |
| address | TEXT | |
| city | TEXT | |
| state | TEXT | |
| zip_code | TEXT | |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

---

### Table: categories
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| name | TEXT | NOT NULL, UNIQUE |
| slug | TEXT | NOT NULL, UNIQUE |
| description | TEXT | |
| image_url | TEXT | |
| meta_title | TEXT | SEO field |
| meta_description | TEXT | SEO field |
| focus_keywords | TEXT[] | SEO field |
| created_at | TIMESTAMP | DEFAULT NOW() |

---

### Table: products
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| category_id | UUID | FOREIGN KEY → categories(id) |
| name | TEXT | NOT NULL |
| slug | TEXT | NOT NULL, UNIQUE |
| description | TEXT | |
| price | DECIMAL(10,2) | NOT NULL |
| images | TEXT[] | DEFAULT '{}' |
| stock_quantity | INTEGER | DEFAULT 0 |
| is_featured | BOOLEAN | DEFAULT FALSE |
| sku | TEXT | UNIQUE |
| shipping_cost | NUMERIC | NOT NULL, DEFAULT 0 |
| video_url | TEXT | |
| meta_title | TEXT | SEO field |
| meta_description | TEXT | SEO field |
| focus_keywords | TEXT[] | SEO field |
| weight_kg | NUMERIC(10,2) | |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

---

### Table: product_images
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| product_id | UUID | FOREIGN KEY → products(id), NOT NULL |
| image_url | TEXT | NOT NULL |
| sort_order | INTEGER | NOT NULL, DEFAULT 0 |
| created_at | TIMESTAMP | DEFAULT NOW() |

---

### Table: product_variations
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| product_id | UUID | FOREIGN KEY → products(id), NOT NULL |
| name | TEXT | NOT NULL (e.g., "Small", "Brown") |
| price | NUMERIC | NOT NULL |
| apply_sale | BOOLEAN | NOT NULL, DEFAULT true |
| sort_order | INTEGER | NOT NULL, DEFAULT 0 |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

---

### Table: orders
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| user_id | UUID | FOREIGN KEY → auth.users(id), NULLABLE (for guests) |
| status | TEXT | NOT NULL, DEFAULT 'pending' |
| total_amount | DECIMAL(10,2) | NOT NULL |
| shipping_address | TEXT | NOT NULL |
| shipping_city | TEXT | NOT NULL |
| shipping_state | TEXT | NULLABLE |
| shipping_zip | TEXT | NULLABLE |
| phone | TEXT | NOT NULL |
| notes | TEXT | Customer notes |
| first_name | TEXT | NOT NULL, DEFAULT '' |
| last_name | TEXT | NOT NULL, DEFAULT '' |
| email | TEXT | For guest checkout |
| admin_notes | TEXT | Admin only |
| customer_confirmation | TEXT | Confirmation details |
| courier_company | TEXT | Shipping courier |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

**Status Values**: 'pending', 'processing', 'shipped', 'delivered', 'cancelled'

---

### Table: order_items
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| order_id | UUID | FOREIGN KEY → orders(id), NOT NULL |
| product_id | UUID | FOREIGN KEY → products(id) |
| quantity | INTEGER | NOT NULL |
| price | DECIMAL(10,2) | NOT NULL |
| variation_id | UUID | FOREIGN KEY → product_variations(id) |
| variation_name | TEXT | Snapshot of variation name |
| variation_price | NUMERIC | Snapshot of variation price |
| created_at | TIMESTAMP | DEFAULT NOW() |

---

### Table: cart_items
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| user_id | UUID | FOREIGN KEY → auth.users(id), NOT NULL |
| product_id | UUID | FOREIGN KEY → products(id), NOT NULL |
| quantity | INTEGER | NOT NULL, DEFAULT 1 |
| variation_id | UUID | FOREIGN KEY → product_variations(id) |
| variation_name | TEXT | Selected variation |
| variation_price | NUMERIC | Selected variation price |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

**Unique Constraint**: (user_id, product_id)

---

### Table: banners
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| title | TEXT | NOT NULL |
| subtitle | TEXT | |
| image_url | TEXT | NOT NULL |
| link_url | TEXT | |
| active | BOOLEAN | NOT NULL, DEFAULT true |
| show_text_overlay | BOOLEAN | NOT NULL, DEFAULT true |
| sort_order | INTEGER | NOT NULL, DEFAULT 0 |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

---

### Table: sales
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| product_id | UUID | FOREIGN KEY → products(id), NULLABLE |
| discount_percentage | NUMERIC | NOT NULL, CHECK (> 0 AND <= 100) |
| start_date | TIMESTAMP | NOT NULL, DEFAULT NOW() |
| end_date | TIMESTAMP | NOT NULL |
| is_active | BOOLEAN | NOT NULL, DEFAULT true |
| is_global | BOOLEAN | NOT NULL, DEFAULT false |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

**Constraints**:
- end_date > start_date
- If is_global = true, product_id must be NULL
- If is_global = false, product_id must be NOT NULL

---

### Table: blogs
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| title | TEXT | NOT NULL |
| slug | TEXT | NOT NULL, UNIQUE |
| content | TEXT | NOT NULL (HTML/Markdown) |
| excerpt | TEXT | Short description |
| meta_title | TEXT | SEO field |
| meta_description | TEXT | SEO field |
| focus_keywords | TEXT[] | SEO field |
| featured_image_url | TEXT | |
| author | TEXT | DEFAULT 'The Shopping Cart' |
| published | BOOLEAN | NOT NULL, DEFAULT false |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

---

### Table: reviews
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| product_id | UUID | FOREIGN KEY → products(id), NOT NULL |
| reviewer_name | TEXT | NOT NULL |
| reviewer_avatar | TEXT | |
| is_verified | BOOLEAN | NOT NULL, DEFAULT false |
| rating | INTEGER | NOT NULL, CHECK (>= 1 AND <= 5) |
| review_title | TEXT | NOT NULL |
| review_text | TEXT | NOT NULL |
| review_images | TEXT[] | DEFAULT '{}' |
| review_date | TIMESTAMP | NOT NULL, DEFAULT NOW() |
| created_at | TIMESTAMP | DEFAULT NOW() |
| updated_at | TIMESTAMP | DEFAULT NOW() |

---

## Storage Buckets

### Bucket: store-images
| Setting | Value |
|---------|-------|
| ID | store-images |
| Public | Yes |
| File Size Limit | 50MB (52428800 bytes) |
| Allowed Types | image/jpeg, image/jpg, image/png, image/webp, image/gif, video/mp4, video/webm, video/ogg |

---

## Enums

### app_role
Values: `'admin'`, `'customer'`

---

## Functions

### has_role(_user_id UUID, _role app_role)
- Returns: BOOLEAN
- Purpose: Check if a user has a specific role
- Security: SECURITY DEFINER

### handle_new_user()
- Returns: TRIGGER
- Purpose: Auto-create profile and assign customer role to new users
- Security: SECURITY DEFINER

### update_updated_at_column()
- Returns: TRIGGER
- Purpose: Automatically update updated_at timestamp
- Security: SECURITY DEFINER

---

## Indexes

| Table | Index Name | Columns |
|-------|-----------|---------|
| sales | idx_sales_product_id | product_id |
| sales | idx_sales_active | is_active, end_date |
| sales | idx_sales_global | is_global (WHERE is_global = true) |
| reviews | idx_reviews_product_id | product_id |
| reviews | idx_reviews_rating | rating |
| product_variations | idx_product_variations_product_id | product_id |

---

## Row Level Security (RLS) Summary

### Public Access (No Auth Required)
- ✅ View categories
- ✅ View products
- ✅ View product images
- ✅ View product variations
- ✅ View active banners
- ✅ View active sales
- ✅ View published blogs
- ✅ View reviews

### Customer Access (Authenticated)
- ✅ View/edit own profile
- ✅ View own roles
- ✅ View/create/update/delete own cart items
- ✅ Create guest or authenticated orders
- ✅ View own orders and order items

### Admin Access
- ✅ Full access to all tables
- ✅ Manage roles
- ✅ Manage products, categories, banners
- ✅ Manage sales, blogs, reviews
- ✅ Update order status
- ✅ Upload/delete images in storage

---

## Relationships Diagram (Simplified)

```
┌─────────────┐
│  auth.users │
└──────┬──────┘
       │
       ├────────────┬──────────────┬──────────────┐
       │            │              │              │
  ┌────▼────┐  ┌───▼──────┐  ┌───▼──────┐  ┌───▼──────┐
  │profiles │  │user_roles│  │cart_items│  │ orders   │
  └─────────┘  └──────────┘  └──────────┘  └────┬─────┘
                                                  │
                                            ┌─────▼──────┐
                                            │order_items │
                                            └─────┬──────┘
                                                  │
  ┌──────────┐           ┌──────────┐           │
  │categories├───────────►products  ◄───────────┘
  └──────────┘           └────┬─────┘
                              │
       ┌──────────────────────┼────────────────────┐
       │                      │                    │
  ┌────▼─────────┐  ┌────────▼─────┐  ┌──────────▼───┐
  │product_images│  │product_       │  │  reviews     │
  └──────────────┘  │variations     │  └──────────────┘
                    └────────┬──────┘
                             │
                      ┌──────▼──────┐
                      │   sales     │
                      └─────────────┘

┌──────────┐
│ banners  │
└──────────┘

┌──────────┐
│  blogs   │
└──────────┘
```

---

## Usage Examples

### Add a Product
```sql
INSERT INTO products (name, slug, description, price, stock_quantity, category_id, sku)
VALUES (
  'Premium Leather Bifold Wallet',
  'premium-leather-bifold-wallet',
  'Handcrafted genuine leather bifold wallet',
  89.99,
  50,
  'category-uuid-here',
  'PLW-001'
);
```

### Add Product Variations
```sql
INSERT INTO product_variations (product_id, name, price, sort_order)
VALUES 
  ('product-uuid', 'Brown - Small', 79.99, 1),
  ('product-uuid', 'Brown - Large', 89.99, 2),
  ('product-uuid', 'Black - Small', 79.99, 3),
  ('product-uuid', 'Black - Large', 89.99, 4);
```

### Create a Sale
```sql
-- Product-specific sale
INSERT INTO sales (product_id, discount_percentage, end_date, is_active)
VALUES ('product-uuid', 20, '2025-12-31', true);

-- Global sale
INSERT INTO sales (discount_percentage, end_date, is_active, is_global)
VALUES (15, '2025-12-31', true, true);
```

### Add a Review
```sql
INSERT INTO reviews (product_id, reviewer_name, rating, review_title, review_text, is_verified)
VALUES (
  'product-uuid',
  'John Doe',
  5,
  'Excellent Quality!',
  'This leather wallet exceeded my expectations. Highly recommended!',
  true
);
```

---

## Notes

- All UUIDs are automatically generated using `gen_random_uuid()` or `uuid_generate_v4()`
- Timestamps are automatically managed by triggers
- RLS policies ensure data security at database level
- Storage bucket handles all media files
- Support for both authenticated users and guest checkout
- SEO-optimized with meta fields for products, categories, and blogs
