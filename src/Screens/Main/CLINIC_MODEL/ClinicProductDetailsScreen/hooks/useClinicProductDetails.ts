import { useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  stock: number;
  images?: string[];
  image?: string;
  category: string;
  weight: string;
  manufacturer?: string;
  licenseNumber?: string;
  composition?: string;
  usage?: string;
  sideEffects?: string;
}

const defaultProduct: Product = {
  id: '',
  name: '',
  brand: '',
  price: 0,
  stock: 0,
  category: '',
  weight: '',
};

export const useClinicProductDetails = (
  product: Product | undefined,
  editMode: boolean
) => {
  const [isEditing, setIsEditing] = useState(editMode);
  const [editedProduct, setEditedProduct] = useState<Product>(product ?? defaultProduct);

  useEffect(() => {
    if (product) setEditedProduct(product);
  }, [product]);

  useEffect(() => {
    setIsEditing(editMode);
  }, [editMode]);

  const displayImages =
    editedProduct.images?.length
      ? editedProduct.images
      : editedProduct.image
        ? [editedProduct.image]
        : [];

  return {
    isEditing,
    setIsEditing,
    editedProduct,
    setEditedProduct,
    displayImages,
  };
};
