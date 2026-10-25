import type { CatalogCategory, CatalogChildCategory, CatalogFilters, CatalogSubcategory } from "../catalog/types";
import { Button, Input, Select } from "./ui";

interface FilterSidebarProps {
  categories: CatalogCategory[];
  subcategories: CatalogSubcategory[];
  childCategories: CatalogChildCategory[];
  filters: CatalogFilters;
  searchValue: string;
  categoryError?: string | null;
  categoriesLoading?: boolean;
  onFilterChange: (key: string, value: string) => void;
  onClear: () => void;
  onRetryCategories?: () => void;
}

function FilterSidebar({
  categories,
  subcategories,
  childCategories,
  filters,
  searchValue,
  categoryError,
  categoriesLoading = false,
  onFilterChange,
  onClear,
  onRetryCategories,
}: FilterSidebarProps) {
  const selectedCategory = categories.find((category) => category.id === Number.parseInt(filters.category, 10));
  const availableSubcategories = selectedCategory?.subcategories?.length
    ? selectedCategory.subcategories
    : subcategories;
  const selectedSubcategory = availableSubcategories.find(
    (subcategory) => subcategory.id === Number.parseInt(filters.subcategory, 10),
  );
  const availableChildren =
    selectedSubcategory?.child_categories && selectedSubcategory.child_categories.length > 0
      ? selectedSubcategory.child_categories
      : childCategories;
  const min = Number(filters.minPrice);
  const max = Number(filters.maxPrice);
  const priceError =
    filters.minPrice !== "" && filters.maxPrice !== "" && min > max
      ? "Minimum price is higher than the maximum."
      : undefined;

  return (
    <div className="space-y-4">
      <Input
        label="Search"
        type="search"
        value={searchValue}
        placeholder="Search products"
        onChange={(event) => onFilterChange("search", event.target.value)}
      />
      {categoryError ? (
        <div className="rounded-ui border border-dashed border-line bg-surface px-3 py-3 text-sm text-muted">
          <p>{categoryError}</p>
          {onRetryCategories ? (
            <Button type="button" size="sm" variant="outline" className="mt-3" loading={categoriesLoading} onClick={onRetryCategories}>
              Try again
            </Button>
          ) : null}
        </div>
      ) : (
        <Select
          label="Category"
          value={filters.category}
          options={[
            { value: "", label: "All categories" },
            ...categories.map((category) => ({ value: String(category.id), label: category.name })),
          ]}
          onChange={(event) => onFilterChange("category", event.target.value)}
        />
      )}
      {filters.category ? (
        <Select
          label="Subcategory"
          value={filters.subcategory}
          options={[
            { value: "", label: "All subcategories" },
            ...availableSubcategories.map((subcategory) => ({
              value: String(subcategory.id),
              label: subcategory.name,
            })),
          ]}
          onChange={(event) => onFilterChange("subcategory", event.target.value)}
        />
      ) : null}
      {filters.subcategory ? (
        <Select
          label="Child category"
          value={filters.childCategory}
          options={[
            { value: "", label: "All child categories" },
            ...availableChildren.map((child) => ({ value: String(child.id), label: child.name })),
          ]}
          onChange={(event) => onFilterChange("childCategory", event.target.value)}
        />
      ) : null}
      <div className="grid grid-cols-2 gap-2">
        <Input
          label="Minimum price"
          type="number"
          min={0}
          inputMode="decimal"
          placeholder="0"
          value={filters.minPrice}
          error={priceError}
          onChange={(event) => onFilterChange("minPrice", event.target.value)}
        />
        <Input
          label="Maximum price"
          type="number"
          min={0}
          inputMode="decimal"
          placeholder="Any"
          value={filters.maxPrice}
          onChange={(event) => onFilterChange("maxPrice", event.target.value)}
        />
      </div>
      <Select
        label="Sort by"
        value={`${filters.sortBy}|${filters.sortOrder || "DESC"}`}
        options={[
          { value: "created_at|DESC", label: "Newest" },
          { value: "price|ASC", label: "Price: low to high" },
          { value: "price|DESC", label: "Price: high to low" },
          { value: "name|ASC", label: "Name: A to Z" },
          { value: "rating|DESC", label: "Highest rated" },
        ]}
        onChange={(event) => onFilterChange("sort", event.target.value)}
      />
      <Button type="button" variant="outline" className="w-full" onClick={onClear}>
        Clear all filters
      </Button>
    </div>
  );
}

export default FilterSidebar;
