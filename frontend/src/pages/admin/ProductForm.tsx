import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import type { Product } from "@shared/catalog";
import AdminLayout from "../../components/admin/AdminLayout";
import ProductFormFields from "../../components/ProductFormFields";
import { Button, EmptyState, Skeleton } from "../../components/ui";
import usePageTitle from "../../hooks/usePageTitle";
import { messageFrom } from "../orders/format";
import {
  asOptions,
  formatDateForInput,
  prepareProductPayload,
  type NamedOption,
  type ProductFormValues,
} from "./productFormModel";

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  usePageTitle(isEdit ? "Edit Product" : "Create Product");
  const [categories, setCategories] = useState<NamedOption[]>([]);
  const [subcategories, setSubcategories] = useState<NamedOption[]>([]);
  const [childCategories, setChildCategories] = useState<NamedOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(isEdit);
  const [categoriesReady, setCategoriesReady] = useState(false);
  const [loadError, setLoadError] = useState("");
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ProductFormValues>();
  const selectedCategory = watch("category_id");
  const selectedSubcategory = watch("subcategory_id");

  useEffect(() => {
    const load = async () => {
      try {
        const response = await axios.get<unknown>("/api/products/categories");
        const list = asOptions(response.data);
        if (!list) {
          setLoadError("Categories could not be loaded");
          setLoadingProduct(false);
          return;
        }
        setCategories(list);
        setCategoriesReady(true);
      } catch (error: unknown) {
        setLoadError(messageFrom(error, "Failed to load categories"));
        setLoadingProduct(false);
      }
    };
    void load();
  }, []);

  useEffect(() => {
    if (!selectedCategory) {
      setSubcategories([]);
      setChildCategories([]);
      return;
    }
    const load = async () => {
      try {
        const response = await axios.get<unknown>(`/api/products/subcategories/${selectedCategory}`);
        setSubcategories(asOptions(response.data) || []);
      } catch (error: unknown) {
        toast.error(messageFrom(error, "Failed to load subcategories"));
      }
    };
    void load();
    if (!isEdit) {
      setValue("subcategory_id", "");
      setValue("child_category_id", "");
      setChildCategories([]);
    }
  }, [selectedCategory, setValue, isEdit]);

  useEffect(() => {
    if (!selectedSubcategory) {
      setChildCategories([]);
      return;
    }
    const load = async () => {
      try {
        const response = await axios.get<unknown>(`/api/products/child-categories/${selectedSubcategory}`);
        setChildCategories(asOptions(response.data) || []);
      } catch (error: unknown) {
        toast.error(messageFrom(error, "Failed to load child categories"));
      }
    };
    void load();
    if (!isEdit) {
      setValue("child_category_id", "");
    }
  }, [selectedSubcategory, setValue, isEdit]);

  useEffect(() => {
    if (!isEdit || !id || !categoriesReady) {
      return;
    }
    const load = async () => {
      setLoadingProduct(true);
      try {
        const response = await axios.get<Product & { category_id?: number; subcategory_id?: number }>(
          `/api/products/${id}`,
        );
        const product = response.data;
        setValue("name", product.name);
        setValue("description", product.description || "");
        setValue("price", String(product.price ?? ""));
        setValue("stock", String(product.stock ?? ""));
        setValue("discount_type", product.discount_type || "");
        setValue("discount_value", product.discount_value == null ? "" : String(product.discount_value));
        setValue("discount_start_date", formatDateForInput(product.discount_start_date));
        setValue("discount_end_date", formatDateForInput(product.discount_end_date));
        if (product.category_id) {
          setValue("category_id", String(product.category_id));
          const subRes = await axios.get<unknown>(`/api/products/subcategories/${product.category_id}`);
          setSubcategories(asOptions(subRes.data) || []);
          if (product.subcategory_id) {
            setValue("subcategory_id", String(product.subcategory_id));
            const childRes = await axios.get<unknown>(`/api/products/child-categories/${product.subcategory_id}`);
            setChildCategories(asOptions(childRes.data) || []);
            if (product.child_category_id) {
              setValue("child_category_id", String(product.child_category_id));
            }
          }
        }
      } catch (error: unknown) {
        toast.error(messageFrom(error, "Failed to load product"));
        navigate("/admin/products");
      } finally {
        setLoadingProduct(false);
      }
    };
    void load();
  }, [id, isEdit, setValue, navigate, categoriesReady]);

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    try {
      const payload = prepareProductPayload(data);
      if (isEdit) {
        await axios.put(`/api/products/${id}`, payload);
        toast.success("Product updated successfully");
      } else {
        await axios.post("/api/products", payload);
        toast.success("Product created successfully");
      }
      navigate("/admin/products");
    } catch (error: unknown) {
      toast.error(messageFrom(error, "Failed to save product"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="mx-auto min-w-0 max-w-4xl">
        <h1 className="font-ui text-3xl font-semibold text-ink">{isEdit ? "Edit product" : "Create product"}</h1>
        {loadError ? (
          <div className="mt-6">
            <EmptyState title="The product form could not be loaded" description={loadError} />
          </div>
        ) : null}
        {loadingProduct ? <Skeleton className="mt-6 h-96" /> : null}
        {!loadError && !loadingProduct ? (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 min-w-0 space-y-4 rounded-ui-lg border border-line bg-surface p-4 text-ink shadow-ui sm:p-6">
            <ProductFormFields
              register={register}
              errors={errors}
              watch={watch}
              categories={categories}
              subcategories={subcategories}
              childCategories={childCategories}
              selectedCategory={selectedCategory}
              selectedSubcategory={selectedSubcategory}
            />
            <div className="sticky bottom-0 z-10 -mx-4 flex flex-col-reverse gap-3 border-t border-line bg-surface px-4 py-3 sm:static sm:mx-0 sm:flex-row sm:justify-end sm:border-0 sm:px-0 sm:py-0">
              <Button type="button" variant="outline" onClick={() => navigate("/admin/products")} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" loading={loading}>
                {isEdit ? "Update product" : "Create product"}
              </Button>
            </div>
          </form>
        ) : null}
      </div>
    </AdminLayout>
  );
}
