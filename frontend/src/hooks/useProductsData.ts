import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import type { SetURLSearchParams } from "react-router-dom";
import {
  asCategoryList,
  asNamedList,
  isCatalogProduct,
  type CatalogCategory,
  type CatalogChildCategory,
  type CatalogFilters,
  type CatalogPagination,
  type CatalogProduct,
  type CatalogSubcategory,
} from "../catalog/types";
import { loadCategories } from "../utils/categoryCache";

const PAGE_SIZE = 15;

const emptyPagination: CatalogPagination = { page: 1, pages: 1, total: 0, limit: PAGE_SIZE };

function initialFilters(searchParams: URLSearchParams): CatalogFilters {
  return {
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    subcategory: searchParams.get("subcategory") || "",
    childCategory: searchParams.get("childCategory") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    sortBy: searchParams.get("sortBy") || "created_at",
    sortOrder: (searchParams.get("sortOrder") || "DESC").toUpperCase(),
    page: Number.parseInt(searchParams.get("page") || "", 10) || 1,
  };
}

function errorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 429) {
      return "Please retry in a moment (rate limited).";
    }
    const message = (error.response?.data as { message?: string } | undefined)?.message;
    return message || fallback;
  }
  return fallback;
}

function listFrom(data: unknown): { products: CatalogProduct[]; pagination: CatalogPagination } | null {
  if (!data || typeof data !== "object" || !("products" in data)) {
    return null;
  }
  const body = data as { products?: unknown; pagination?: Partial<CatalogPagination> };
  if (!Array.isArray(body.products)) {
    return null;
  }
  const pagination = body.pagination ?? {};
  return {
    products: body.products.filter(isCatalogProduct),
    pagination: {
      page: Number(pagination.page) || 1,
      pages: Number(pagination.pages) || 1,
      total: Number(pagination.total) || 0,
      limit: Number(pagination.limit) || PAGE_SIZE,
    },
  };
}

export function useProductsData(searchParams: URLSearchParams, setSearchParams: SetURLSearchParams) {
  const [filters, setFilters] = useState<CatalogFilters>(() => initialFilters(searchParams));
  const [isFilterOpen, setIsFilterOpen] = useState(Boolean(searchParams.get("openFilters")));
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [pagination, setPagination] = useState<CatalogPagination>(emptyPagination);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [subcategories, setSubcategories] = useState<CatalogSubcategory[]>([]);
  const [childCategories, setChildCategories] = useState<CatalogChildCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const [categoriesLoaded, setCategoriesLoaded] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(initialFilters(searchParams).search);
  const searchDebounceRef = useRef<number | null>(null);
  const requestId = useRef(0);
  const isUpdatingFromUrl = useRef(false);
  const categoriesCacheRef = useRef<CatalogCategory[] | null>(null);
  const isHydratingSubcategoryRef = useRef(false);

  const fetchProducts = async () => {
    const id = requestId.current + 1;
    requestId.current = id;
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.category) params.append("category", filters.category);
      if (filters.subcategory) params.append("subcategory", filters.subcategory);
      if (filters.childCategory) params.append("childCategory", filters.childCategory);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      if (filters.sortBy) params.append("sortBy", filters.sortBy);
      if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);
      params.append("page", String(filters.page));
      params.append("limit", String(PAGE_SIZE));

      const response = await axios.get(`/api/products?${params}`);
      if (id !== requestId.current) {
        return;
      }
      const list = listFrom(response.data);
      if (!list) {
        setProducts([]);
        setPagination(emptyPagination);
        setLoadError("Products could not be loaded.");
        return;
      }
      setProducts(list.products);
      setPagination(list.pagination);
      setLoadError(null);
    } catch (error) {
      if (id !== requestId.current) {
        return;
      }
      const message = errorMessage(error, "Failed to load products");
      setProducts([]);
      setPagination(emptyPagination);
      setLoadError(message);
      toast.error(message);
    } finally {
      if (id === requestId.current) {
        setLoading(false);
      }
    }
  };

  const fetchCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await axios.get("/api/products/categories");
      const list = asCategoryList(response.data);
      if (!list) {
        setCategories([]);
        setCategoryError("Categories could not be loaded.");
        return;
      }
      setCategories(list);
      setCategoryError(null);
    } catch (error) {
      setCategories([]);
      setCategoryError(errorMessage(error, "Failed to load categories"));
    } finally {
      setCategoriesLoaded(true);
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    if (!filters.category && filters.subcategory && !categoriesLoaded) {
      return;
    }

    if (!filters.category && filters.subcategory && categories.length > 0 && !isHydratingSubcategoryRef.current) {
      const subcategoryId = Number.parseInt(filters.subcategory, 10);
      for (const category of categories) {
        const subcategory = (category.subcategories || []).find((sub) => sub.id === subcategoryId);
        if (subcategory) {
          isHydratingSubcategoryRef.current = true;
          setSubcategories(category.subcategories || []);
          setFilters((prev) => ({
            ...prev,
            category: category.id.toString(),
            subcategory: filters.subcategory,
          }));
          window.setTimeout(() => {
            isHydratingSubcategoryRef.current = false;
          }, 100);
          return;
        }
      }
      const hydrateSubcategory = async () => {
        if (isHydratingSubcategoryRef.current) {
          return;
        }
        isHydratingSubcategoryRef.current = true;
        try {
          const allCategories = asCategoryList(await loadCategories()) ?? [];
          for (const category of allCategories) {
            const subcategory = (category.subcategories || []).find((sub) => sub.id === subcategoryId);
            if (subcategory) {
              setCategories(allCategories);
              setSubcategories(category.subcategories || []);
              setFilters((prev) => ({
                ...prev,
                category: category.id.toString(),
                subcategory: filters.subcategory,
              }));
              isHydratingSubcategoryRef.current = false;
              return;
            }
          }
          isHydratingSubcategoryRef.current = false;
        } catch {
          isHydratingSubcategoryRef.current = false;
        }
      };
      void hydrateSubcategory();
      return;
    }

    if (!filters.category) {
      setSubcategories([]);
      setChildCategories([]);
      setFilters((prev) =>
        prev.subcategory === "" && prev.childCategory === ""
          ? prev
          : { ...prev, subcategory: "", childCategory: "" },
      );
      return;
    }

    const selected = categories.find((category) => category.id === Number.parseInt(filters.category, 10));
    if (selected?.subcategories) {
      setSubcategories(selected.subcategories);
      if (filters.subcategory) {
        const selectedSub = selected.subcategories.find(
          (sub) => sub.id === Number.parseInt(filters.subcategory, 10),
        );
        setChildCategories(
          selectedSub?.child_categories && Array.isArray(selectedSub.child_categories)
            ? selectedSub.child_categories
            : [],
        );
      } else {
        setChildCategories([]);
      }
      const subcategoryExists = selected.subcategories.some(
        (sub) => sub.id === Number.parseInt(filters.subcategory, 10),
      );
      if (!subcategoryExists && filters.subcategory) {
        setFilters((prev) => ({ ...prev, subcategory: "", childCategory: "" }));
      }
      return;
    }

    const fetchSubs = async () => {
      try {
        const response = await axios.get(`/api/products/subcategories/${filters.category}`);
        const list = asNamedList<CatalogSubcategory>(response.data);
        setSubcategories(list);
        setChildCategories([]);
        const subcategoryExists = list.some((sub) => sub.id === Number.parseInt(filters.subcategory, 10));
        if (!subcategoryExists && filters.subcategory) {
          setFilters((prev) => ({ ...prev, subcategory: "", childCategory: "" }));
        }
      } catch (error) {
        if (!axios.isAxiosError(error) || error.response?.status !== 429) {
          toast.error(errorMessage(error, "Failed to load subcategories"));
        }
      }
    };
    void fetchSubs();
  }, [filters.category, filters.subcategory, categories, categoriesLoaded]);

  useEffect(() => {
    if (!filters.subcategory) {
      setChildCategories([]);
      setFilters((prev) => (prev.childCategory === "" ? prev : { ...prev, childCategory: "" }));
      return;
    }

    const selected = subcategories.find((sub) => sub.id === Number.parseInt(filters.subcategory, 10));
    if (selected?.child_categories && selected.child_categories.length > 0) {
      setChildCategories(selected.child_categories);
      return;
    }

    const fetchChildren = async () => {
      try {
        const response = await axios.get(`/api/products/child-categories/${filters.subcategory}`);
        setChildCategories(asNamedList<CatalogChildCategory>(response.data));
      } catch (error) {
        if (!axios.isAxiosError(error) || error.response?.status !== 429) {
          toast.error(errorMessage(error, "Failed to load child categories"));
        }
        setChildCategories([]);
      }
    };
    void fetchChildren();
  }, [filters.subcategory, subcategories]);

  useEffect(() => {
    const hydrate = async () => {
      if (!filters.childCategory || categories.length === 0) {
        return;
      }
      try {
        const childRes = await axios.get(`/api/products/child-category/${filters.childCategory}`);
        const childInfo = childRes.data as { subcategory_id?: number } | null;
        if (!childInfo?.subcategory_id) {
          return;
        }

        const parentCategory = categories.find((category) =>
          (category.subcategories || []).some((sub) => sub.id === childInfo.subcategory_id),
        );
        const parentSub = parentCategory?.subcategories?.find((sub) => sub.id === childInfo.subcategory_id);
        if (parentCategory && parentSub) {
          setSubcategories(parentCategory.subcategories || []);
          if (parentSub.child_categories && parentSub.child_categories.length > 0) {
            setChildCategories(parentSub.child_categories);
          } else {
            const childListRes = await axios.get(`/api/products/child-categories/${parentSub.id}`);
            setChildCategories(asNamedList<CatalogChildCategory>(childListRes.data));
          }
          setFilters((prev) => ({
            ...prev,
            category: parentCategory.id.toString(),
            subcategory: parentSub.id.toString(),
            childCategory: filters.childCategory,
          }));
          return;
        }

        const subRes = await axios.get(`/api/products/subcategories/${childInfo.subcategory_id}`);
        const subRaw = Array.isArray(subRes.data) ? subRes.data[0] : subRes.data;
        const sub = subRaw as { id?: number; category_id?: number } | null;
        if (sub?.category_id && sub.id) {
          if (!categoriesCacheRef.current) {
            const catRes = await axios.get("/api/products/categories");
            categoriesCacheRef.current = asCategoryList(catRes.data) ?? [];
          }
          const categoryList = categoriesCacheRef.current || [];
          const category = categoryList.find((item) => item.id === sub.category_id);
          if (category) {
            setCategories(categoryList);
            setSubcategories(category.subcategories || []);
            const childListRes = await axios.get(`/api/products/child-categories/${sub.id}`);
            setChildCategories(asNamedList<CatalogChildCategory>(childListRes.data));
            setFilters((prev) => ({
              ...prev,
              category: String(sub.category_id),
              subcategory: String(sub.id),
              childCategory: filters.childCategory,
            }));
          }
        }
      } catch (error) {
        if (!axios.isAxiosError(error) || error.response?.status !== 429) {
          toast.error(errorMessage(error, "Failed to load child category"));
        }
      }
    };
    void hydrate();
  }, [filters.childCategory, categories]);

  useEffect(() => {
    const nextFilters = initialFilters(searchParams);
    setFilters(nextFilters);
    setSearchInput(nextFilters.search);
    setIsFilterOpen(Boolean(searchParams.get("openFilters")));
    isUpdatingFromUrl.current = true;
  }, [searchParams]);

  useEffect(() => {
    if (isUpdatingFromUrl.current) {
      isUpdatingFromUrl.current = false;
      return;
    }
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.subcategory) params.set("subcategory", filters.subcategory);
    if (filters.childCategory) params.set("childCategory", filters.childCategory);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.sortBy && filters.sortBy !== "created_at") params.set("sortBy", filters.sortBy);
    if (filters.sortOrder && filters.sortOrder !== "DESC") params.set("sortOrder", filters.sortOrder);
    if (filters.page > 1) params.set("page", filters.page.toString());
    if (isFilterOpen) params.set("openFilters", "1");
    if (searchParams.toString() !== params.toString()) {
      setSearchParams(params, { replace: true });
    }
  }, [filters, setSearchParams, searchParams, isFilterOpen]);

  useEffect(() => {
    void fetchCategories();
  }, []);

  useEffect(() => {
    void fetchProducts();
  }, [filters]);

  useEffect(() => {
    return () => {
      if (searchDebounceRef.current) {
        window.clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const openHandler = () => setIsFilterOpen(true);
    const toggleHandler = () => setIsFilterOpen((prev) => !prev);
    window.addEventListener("open-filters", openHandler);
    window.addEventListener("toggle-filters", toggleHandler);
    return () => {
      window.removeEventListener("open-filters", openHandler);
      window.removeEventListener("toggle-filters", toggleHandler);
    };
  }, []);

  const handleFilterChange = (key: string, value: string) => {
    if (key === "sort") {
      const [field, order] = value.split("|");
      setFilters((prev) => ({
        ...prev,
        sortBy: field || "created_at",
        sortOrder: order?.toUpperCase() || "DESC",
        page: 1,
      }));
      return;
    }
    if (key === "search") {
      if (searchDebounceRef.current) {
        window.clearTimeout(searchDebounceRef.current);
      }
      setSearchInput(value);
      searchDebounceRef.current = window.setTimeout(() => {
        setFilters((prev) => ({ ...prev, search: value, page: 1 }));
      }, 500);
      return;
    }
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => setFilters((prev) => ({ ...prev, page }));

  const clearFilters = () => {
    setSearchInput("");
    setFilters({
      search: "",
      category: "",
      subcategory: "",
      childCategory: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "created_at",
      sortOrder: "DESC",
      page: 1,
    });
  };

  return {
    filters,
    searchInput,
    products,
    pagination,
    categories,
    subcategories,
    childCategories,
    loading,
    loadError,
    categoryError,
    categoriesLoading,
    handleFilterChange,
    handlePageChange,
    clearFilters,
    reloadProducts: () => {
      void fetchProducts();
    },
    reloadCategories: () => {
      void fetchCategories();
    },
    isFilterOpen,
    openFilter: () => setIsFilterOpen(true),
    closeFilter: () => setIsFilterOpen(false),
  };
}
