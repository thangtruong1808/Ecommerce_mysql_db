import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import ProductFormFields from "../ProductFormFields";
import { Button, Modal } from "../ui";
import { messageFrom } from "../../pages/orders/format";
import {
  asOptions,
  formatDateForInput,
  prepareProductPayload,
  type NamedOption,
  type ProductFormValues,
} from "../../pages/admin/productFormModel";
import type { Product } from "@shared/catalog";

interface ProductFormModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  product?: (Product & { category_id?: number; subcategory_id?: number }) | null;
}

export default function ProductFormModal({
  isOpen = false,
  onClose,
  onSuccess,
  product = null,
}: ProductFormModalProps) {
  const isEdit = Boolean(product);
  const [categories, setCategories] = useState<NamedOption[]>([]);
  const [subcategories, setSubcategories] = useState<NamedOption[]>([]);
  const [childCategories, setChildCategories] = useState<NamedOption[]>([]);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = useForm<ProductFormValues>();
  const selectedCategory = watch("category_id");
  const selectedSubcategory = watch("subcategory_id");

  useEffect(() => {
    if (!isOpen) {
      reset();
      setSubcategories([]);
      setChildCategories([]);
    }
  }, [isOpen, reset]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    const load = async () => {
      try {
        const response = await axios.get<unknown>("/api/products/categories");
        const list = asOptions(response.data);
        if (!list) {
          toast.error("Categories could not be loaded");
          return;
        }
        setCategories(list);
      } catch (error: unknown) {
        toast.error(messageFrom(error, "Failed to load categories"));
      }
    };
    void load();
  }, [isOpen]);

  useEffect(() => {
    if (!selectedCategory || !isOpen) {
      if (!selectedCategory) {
        setSubcategories([]);
        setChildCategories([]);
      }
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
  }, [selectedCategory, isOpen, setValue, isEdit]);

  useEffect(() => {
    if (!selectedSubcategory || !isOpen) {
      if (!selectedSubcategory) {
        setChildCategories([]);
      }
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
  }, [selectedSubcategory, isOpen, setValue, isEdit]);

  useEffect(() => {
    if (!isEdit || !product || categories.length === 0 || !isOpen) {
      return;
    }
    setValue("name", product.name);
    setValue("description", product.description || "");
    setValue("price", String(product.price ?? ""));
    setValue("stock", String(product.stock ?? ""));
    setValue("discount_type", product.discount_type || "");
    setValue("discount_value", product.discount_value == null ? "" : String(product.discount_value));
    setValue("discount_start_date", formatDateForInput(product.discount_start_date));
    setValue("discount_end_date", formatDateForInput(product.discount_end_date));
    if (!product.category_id) {
      return;
    }
    setValue("category_id", String(product.category_id));
    const load = async () => {
      try {
        const subRes = await axios.get<unknown>(`/api/products/subcategories/${product.category_id}`);
        setSubcategories(asOptions(subRes.data) || []);
        if (!product.subcategory_id) {
          return;
        }
        setValue("subcategory_id", String(product.subcategory_id));
        const childRes = await axios.get<unknown>(`/api/products/child-categories/${product.subcategory_id}`);
        setChildCategories(asOptions(childRes.data) || []);
        if (product.child_category_id) {
          setValue("child_category_id", String(product.child_category_id));
        }
      } catch (error: unknown) {
        toast.error(messageFrom(error, "Failed to load categories"));
      }
    };
    void load();
  }, [isEdit, product, categories, setValue, isOpen]);

  const onSubmit = async (data: ProductFormValues) => {
    setLoading(true);
    try {
      const payload = prepareProductPayload(data);
      if (isEdit && product) {
        await axios.put(`/api/products/${product.id}`, payload);
        toast.success("Product updated successfully");
      } else {
        await axios.post("/api/products", payload);
        toast.success("Product created successfully");
      }
      onSuccess?.();
      onClose();
    } catch (error: unknown) {
      toast.error(messageFrom(error, "Failed to save product"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      title={isEdit ? "Edit product" : "Create product"}
      onClose={() => {
        if (!loading) {
          onClose();
        }
      }}
      className="max-w-4xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        <div className="flex flex-col-reverse justify-end gap-3 border-t border-line pt-4 sm:flex-row">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" loading={loading}>
            {isEdit ? "Update product" : "Create product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
