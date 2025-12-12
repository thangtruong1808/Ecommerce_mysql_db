# Database Migrations

## Migration: Allow NULL user_id in carts table

**File:** `allow_null_user_id_in_carts.sql`  
**Date:** 2025-12-12  
**Author:** Thang Truong

### Purpose
This migration allows the `user_id` column in the `carts` table to accept `NULL` values, enabling guest (unauthenticated) users to have carts stored in the database.

### Error Fixed
- **Error:** `Column "user_id" cannot be null`
- **Cause:** The database schema had `user_id INT NOT NULL`, preventing guest carts from being created
- **Solution:** Modify the column to allow `NULL` values

### How to Run

#### Option 1: Using the Migration Script (Recommended)
```bash
# From the project root directory
node database/migrations/run_migration.js
```

#### Option 2: Using MySQL Client
```bash
# From the project root directory
mysql -u your_username -p ecommerce_db < database/migrations/allow_null_user_id_in_carts.sql
```

#### Option 3: Manual Execution
1. Open MySQL client: `mysql -u your_username -p`
2. Select database: `USE ecommerce_db;`
3. Run the SQL commands from `allow_null_user_id_in_carts.sql`

### Verification
After running the migration, verify it worked:
```sql
SELECT IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'ecommerce_db' 
AND TABLE_NAME = 'carts' 
AND COLUMN_NAME = 'user_id';
```
Expected result: `IS_NULLABLE = 'YES'`

### What This Migration Does
1. Drops the foreign key constraint `carts_ibfk_1`
2. Modifies `user_id` column to allow `NULL` (removes `NOT NULL` and `UNIQUE` constraints)
3. Re-adds the foreign key constraint (allows `NULL` values)

### Notes
- Guest carts will have `user_id = NULL`
- Authenticated user carts will have `user_id = <user_id>`
- When a guest user logs in, their cart is transferred to their user account

---

## Migration: Fix invoice number collation issue

**File:** `fix_invoice_number_collation.sql`  
**Date:** 2025-12-12  
**Author:** Thang Truong

### Purpose
This migration fixes the collation mismatch error in the `generate_invoice_number()` function that occurs when placing orders.

### Error Fixed
- **Error:** `illegal mix of collations (utf8mb4_unicode_ci,IMPLICIT) and (utf8mb4_0900_ai_ci,IMPLICIT) for operation 'like'`
- **Cause:** The LIKE operation in `generate_invoice_number()` function compares columns/strings with different collations
- **Solution:** Add explicit COLLATE clauses to ensure consistent collation in the LIKE operation

### How to Run

#### Option 1: Using MySQL Client
```bash
# From the project root directory
mysql -u your_username -p ecommerce_db < database/migrations/fix_invoice_number_collation.sql
```

#### Option 2: Manual Execution
1. Open MySQL client: `mysql -u your_username -p`
2. Select database: `USE ecommerce_db;`
3. Run the SQL commands from `fix_invoice_number_collation.sql`

### What This Migration Does
1. Drops the existing `generate_invoice_number()` function
2. Recreates the function with explicit `COLLATE utf8mb4_unicode_ci` clauses in the LIKE operation
3. Ensures consistent collation for string comparisons

### Notes
- This migration is safe to run multiple times (idempotent)
- The function will be recreated with the correct collation handling
- New databases created from `schema.sql` will already have this fix
