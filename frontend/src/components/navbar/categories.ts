export interface NavChildCategory {
  id: number;
  name: string;
}

export interface NavSubcategory {
  id: number;
  name: string;
  child_categories?: NavChildCategory[] | null;
}

export interface NavCategory {
  id: number;
  name: string;
  subcategories?: NavSubcategory[] | null;
}

export type CategoryStatus = "loading" | "ready" | "error";

export function normalizeCategories(data: unknown): NavCategory[] | null {
  if (!Array.isArray(data)) {
    return null;
  }
  return data
    .filter((item): item is NavCategory => {
      if (!item || typeof item !== "object") {
        return false;
      }
      const category = item as Partial<NavCategory>;
      return typeof category.id === "number" && typeof category.name === "string";
    })
    .map((category) => ({
      ...category,
      subcategories: Array.isArray(category.subcategories)
        ? category.subcategories
        : [],
    }))
    .sort((a, b) => a.id - b.id);
}

export function childCategoriesOf(subcategory: NavSubcategory): NavChildCategory[] {
  return Array.isArray(subcategory.child_categories)
    ? subcategory.child_categories
    : [];
}

export function clearanceLayout(subcategoryCount: number): {
  row: number;
  columnStart: number;
  columnSpan: number;
} {
  if (subcategoryCount === 0) {
    return { row: 1, columnStart: 1, columnSpan: 4 };
  }
  if (subcategoryCount <= 3) {
    return {
      row: 1,
      columnStart: subcategoryCount + 1,
      columnSpan: 4 - subcategoryCount,
    };
  }
  const fullRows = Math.floor(subcategoryCount / 4);
  const remaining = subcategoryCount % 4;
  if (remaining === 0) {
    return { row: fullRows + 1, columnStart: 1, columnSpan: 4 };
  }
  return {
    row: fullRows + 1,
    columnStart: remaining + 1,
    columnSpan: 4 - remaining,
  };
}
