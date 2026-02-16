import { useState, useEffect } from 'react';
import { useRoute, useNavigation } from '@react-navigation/native';
import { toast } from '@backpackapp-io/react-native-toast';

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

export const useFactoryProductDetails = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const product = route.params?.product as Product;
  const editMode = route.params?.editMode || false;

  const [isEditing, setIsEditing] = useState(editMode);
  const [editedProduct, setEditedProduct] = useState<Product>(product);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setEditedProduct(product);
    }
  }, [product]);

  useEffect(() => {
    setIsEditing(editMode);
  }, [editMode]);

  const handleSave = async () => {
    if (
      !editedProduct.name ||
      !editedProduct.brand ||
      !editedProduct.price ||
      !editedProduct.stock ||
      !editedProduct.category ||
      !editedProduct.weight
    ) {
      toast.error('Please fill all required fields');
      return;
    }

    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
    setIsEditing(false);
    toast.success('Product updated successfully');
    navigation.goBack();
  };

  const handleDelete = () => {
    // In real app, delete from backend/store
    toast.success('Product deleted');
    navigation.goBack();
  };

  const handleImagesUpdate = (images: string[]) => {
    setEditedProduct({ ...editedProduct, images, image: images[0] });
  };

  const displayImages =
    editedProduct.images && editedProduct.images.length > 0
      ? editedProduct.images
      : editedProduct.image
      ? [editedProduct.image]
      : [];

  return {
    // Data
    product: editedProduct,
    isEditing,
    displayImages,

    // Actions
    setIsEditing,
    setEditedProduct,
    handleSave,
    handleDelete,
    handleImagesUpdate,

    // Loading
    saving,
  };
};
