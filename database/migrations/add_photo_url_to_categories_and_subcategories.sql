-- Migration: Add photo_url columns to categories and subcategories tables
-- Date: 2025-01-28
-- Author: Thang Truong

USE ecommerce-mysql-db;

-- Add photo_url column to categories table
ALTER TABLE categories 
ADD COLUMN photo_url VARCHAR(500) NULL 
AFTER description;

-- Add photo_url column to subcategories table
ALTER TABLE subcategories 
ADD COLUMN photo_url VARCHAR(500) NULL 
AFTER description;

