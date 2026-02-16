import { useState, useMemo } from 'react';
import { toast } from '@backpackapp-io/react-native-toast';

export interface ClinicProduct {
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

// Dummy data
const DUMMY_PRODUCTS: ClinicProduct[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    brand: 'Dolo',
    price: 25,
    stock: 150,
    category: 'Pain Relief',
    weight: '15 Tablets',
    manufacturer: 'Micro Labs',
    licenseNumber: 'DL-2024-001',
    composition: 'Paracetamol IP 500mg',
    usage: 'Pain relief, Fever reduction',
    sideEffects: 'Nausea, Dizziness',
    images: [],
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    brand: 'Cipla',
    price: 45,
    stock: 80,
    category: 'Antibiotic',
    weight: '10 Capsules',
    manufacturer: 'Cipla Ltd',
    licenseNumber: 'DL-2024-002',
    composition: 'Amoxicillin Trihydrate 250mg',
    usage: 'Bacterial infections',
    sideEffects: 'Diarrhea, Nausea',
    images: [],
  },
];

const CATEGORIES = [
  { label: 'All', value: 'all' },
  { label: 'Pain Relief', value: 'Pain Relief' },
  { label: 'Antibiotic', value: 'Antibiotic' },
  { label: 'Vitamins', value: 'Vitamins' },
  { label: 'Supplements', value: 'Supplements' },
];

export const useClinicProducts = () => {
  const [products, setProducts] = useState<ClinicProduct[]>(DUMMY_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: '',
    price: '',
    stock: '',
    category: '',
    weight: '',
    manufacturer: '',
    licenseNumber: '',
    composition: '',
    usage: '',
    sideEffects: '',
    images: [] as string[],
  });

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Add product
  const handleAddProduct = () => {
    if (
      !newProduct.name ||
      !newProduct.brand ||
      !newProduct.price ||
      !newProduct.stock ||
      !newProduct.category ||
      !newProduct.weight
    ) {
      toast.error('Please fill all required fields');
      return;
    }

    const product: ClinicProduct = {
      id: Date.now().toString(),
      name: newProduct.name,
      brand: newProduct.brand,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      category: newProduct.category,
      weight: newProduct.weight,
      manufacturer: newProduct.manufacturer || undefined,
      licenseNumber: newProduct.licenseNumber || undefined,
      composition: newProduct.composition || undefined,
      usage: newProduct.usage || undefined,
      sideEffects: newProduct.sideEffects || undefined,
      images: newProduct.images.length > 0 ? newProduct.images : undefined,
      image: newProduct.images.length > 0 ? newProduct.images[0] : undefined,
    };

    setProducts([...products, product]);
    resetNewProduct();
    setShowAddModal(false);
    toast.success('Product added successfully');
  };

  // Reset new product form
  const resetNewProduct = () => {
    setNewProduct({
      name: '',
      brand: '',
      price: '',
      stock: '',
      category: '',
      weight: '',
      manufacturer: '',
      licenseNumber: '',
      composition: '',
      usage: '',
      sideEffects: '',
      images: [],
    });
  };

  // Delete product
  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    toast.success('Product deleted');
  };

  // Refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Get product by ID
  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  return {
    // Data
    products: filteredProducts,
    allProducts: products,
    categories: CATEGORIES,

    // Search & Filters
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,

    // Modal
    showAddModal,
    setShowAddModal,
    newProduct,
    setNewProduct,

    // Actions
    handleAddProduct,
    handleDeleteProduct,
    resetNewProduct,

    // Loading
    loading,
    refreshing,
    handleRefresh,

    // Helpers
    getProductById,
  };
};
