import type { FieldErrors, UseFormRegister, UseFormWatch } from "react-hook-form";
import { controlClass } from "./ui/styles";
import type { NamedOption, ProductFormValues } from "../pages/admin/productFormModel";

interface ProductFormFieldsProps {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  watch: UseFormWatch<ProductFormValues>;
  categories?: NamedOption[];
  subcategories?: NamedOption[];
  childCategories?: NamedOption[];
  selectedCategory?: string;
  selectedSubcategory?: string;
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }
  return <p className="mt-1 text-sm text-danger">{message}</p>;
}

export default function ProductFormFields({
  register,
  errors,
  watch,
  categories = [],
  subcategories = [],
  childCategories = [],
  selectedCategory,
  selectedSubcategory,
}: ProductFormFieldsProps) {
  return (
    <>
      <div>
        <label htmlFor="product-name" className="mb-2 block text-sm font-medium text-ink">
          Product name
        </label>
        <input
          id="product-name"
          type="text"
          {...register("name", { required: "Product name is required" })}
          className={controlClass(Boolean(errors.name))}
        />
        <FieldError message={errors.name?.message} />
      </div>

      <div>
        <label htmlFor="product-description" className="mb-2 block text-sm font-medium text-ink">
          Description
        </label>
        <textarea
          id="product-description"
          rows={4}
          {...register("description", { required: "Description is required" })}
          className={controlClass(Boolean(errors.description))}
        />
        <FieldError message={errors.description?.message} />
      </div>

      <div>
        <label htmlFor="product-category" className="mb-2 block text-sm font-medium text-ink">
          Category
        </label>
        <select
          id="product-category"
          {...register("category_id", { required: "Category is required" })}
          className={controlClass(Boolean(errors.category_id))}
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <FieldError message={errors.category_id?.message} />
      </div>

      <div>
        <label htmlFor="product-subcategory" className="mb-2 block text-sm font-medium text-ink">
          Subcategory
        </label>
        <select
          id="product-subcategory"
          {...register("subcategory_id", {
            validate: (value) => (selectedCategory && !value ? "Subcategory is required" : true),
          })}
          className={controlClass(Boolean(errors.subcategory_id))}
        >
          <option value="">{selectedCategory ? "Select subcategory" : "Select a category first"}</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>
        <FieldError message={errors.subcategory_id?.message} />
      </div>

      <div>
        <label htmlFor="product-child-category" className="mb-2 block text-sm font-medium text-ink">
          Child category
        </label>
        <select
          id="product-child-category"
          {...register("child_category_id", {
            validate: (value) => (selectedSubcategory && !value ? "Child category is required" : true),
          })}
          className={controlClass(Boolean(errors.child_category_id))}
        >
          <option value="">{selectedSubcategory ? "Select child category" : "Select a subcategory first"}</option>
          {childCategories.map((child) => (
            <option key={child.id} value={child.id}>
              {child.name}
            </option>
          ))}
        </select>
        <FieldError message={errors.child_category_id?.message} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="product-price" className="mb-2 block text-sm font-medium text-ink">
            Price
          </label>
          <input
            id="product-price"
            type="number"
            step="0.01"
            {...register("price", {
              required: "Price is required",
              min: { value: 0, message: "Price cannot be negative" },
            })}
            className={controlClass(Boolean(errors.price))}
          />
          <FieldError message={errors.price?.message} />
        </div>
        <div>
          <label htmlFor="product-stock" className="mb-2 block text-sm font-medium text-ink">
            Stock
          </label>
          <input
            id="product-stock"
            type="number"
            {...register("stock", {
              required: "Stock is required",
              min: { value: 0, message: "Stock cannot be negative" },
            })}
            className={controlClass(Boolean(errors.stock))}
          />
          <FieldError message={errors.stock?.message} />
        </div>
      </div>

      <div className="border-t border-line pt-4">
        <h3 className="mb-4 text-sm font-semibold text-ink">Discount</h3>
        <div className="mb-4">
          <label htmlFor="product-discount-type" className="mb-2 block text-sm font-medium text-ink">
            Discount type
          </label>
          <select
            id="product-discount-type"
            {...register("discount_type", {
              validate: (value) => {
                if (value && !watch("discount_value")) {
                  return "Discount value is required when a discount type is selected";
                }
                return true;
              },
            })}
            className={controlClass(Boolean(errors.discount_type))}
          >
            <option value="">None</option>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed amount</option>
          </select>
          <FieldError message={errors.discount_type?.message} />
        </div>
        <div className="mb-4">
          <label htmlFor="product-discount-value" className="mb-2 block text-sm font-medium text-ink">
            Discount value
          </label>
          <input
            id="product-discount-value"
            type="number"
            step="0.01"
            min="0"
            {...register("discount_value", {
              validate: (value) => {
                const discountType = watch("discount_type");
                const price = Number(watch("price")) || 0;
                if (discountType && !value) {
                  return "Discount value is required when a discount type is selected";
                }
                if (value && !discountType) {
                  return "Discount type is required when a discount value is provided";
                }
                if (!value) {
                  return true;
                }
                const amount = Number(value);
                if (discountType === "percentage" && (amount <= 0 || amount > 100)) {
                  return "Percentage must be between 0 and 100";
                }
                if (discountType === "fixed" && amount <= 0) {
                  return "Fixed discount must be positive";
                }
                if (discountType === "fixed" && price > 0 && amount >= price) {
                  return "Fixed discount must be less than the product price";
                }
                return true;
              },
            })}
            className={controlClass(Boolean(errors.discount_value))}
          />
          <FieldError message={errors.discount_value?.message} />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="product-discount-start" className="mb-2 block text-sm font-medium text-ink">
              Start date
            </label>
            <input
              id="product-discount-start"
              type="datetime-local"
              {...register("discount_start_date", {
                validate: (value) => {
                  const endDate = watch("discount_end_date");
                  if (watch("discount_type") && !value) {
                    return "Start date is required when a discount is set";
                  }
                  if (value && endDate && new Date(value) >= new Date(endDate)) {
                    return "Start date must be before the end date";
                  }
                  return true;
                },
              })}
              className={controlClass(Boolean(errors.discount_start_date))}
            />
            <FieldError message={errors.discount_start_date?.message} />
          </div>
          <div>
            <label htmlFor="product-discount-end" className="mb-2 block text-sm font-medium text-ink">
              End date
            </label>
            <input
              id="product-discount-end"
              type="datetime-local"
              {...register("discount_end_date", {
                validate: (value) => {
                  const startDate = watch("discount_start_date");
                  if (watch("discount_type") && !value) {
                    return "End date is required when a discount is set";
                  }
                  if (value && startDate && new Date(value) <= new Date(startDate)) {
                    return "End date must be after the start date";
                  }
                  return true;
                },
              })}
              className={controlClass(Boolean(errors.discount_end_date))}
            />
            <FieldError message={errors.discount_end_date?.message} />
          </div>
        </div>
      </div>
    </>
  );
}
