import { useState, useMemo } from 'react';
import { toast } from '@backpackapp-io/react-native-toast';

export interface FactoryProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  minOrder: number;
  stock: number;
  manufacturer: string;
  licenseNumber: string;
  composition: string;
  images?: string[];
}

// Dummy data
const DUMMY_PRODUCTS: FactoryProduct[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    brand: 'Dolo',
    category: 'Tablets',
    price: 25,
    minOrder: 1000,
    stock: 50000,
    manufacturer: 'Micro Labs',
    licenseNumber: 'DL-2024-001',
    composition: 'Paracetamol 500mg',
    images: [],
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    brand: 'Cipla',
    category: 'Capsules',
    price: 45,
    minOrder: 500,
    stock: 25000,
    manufacturer: 'Cipla Ltd',
    licenseNumber: 'DL-2024-002',
    composition: 'Amoxicillin Trihydrate 250mg',
    images: [],
  },
  {
    id: '3',
    name: 'Azithromycin 500mg',
    brand: 'Zithromax',
    category: 'Tablets',
    price: 120,
    minOrder: 200,
    stock: 15000,
    manufacturer: 'Pfizer',
    licenseNumber: 'DL-2024-003',
    composition: 'Azithromycin Dihydrate 500mg',
    images: [],
  },
  {
    id: '4',
    name: 'Cough Syrup',
    brand: 'Benadryl',
    category: 'Syrups',
    price: 85,
    minOrder: 100,
    stock: 8000,
    manufacturer: 'Johnson & Johnson',
    licenseNumber: 'DL-2024-004',
    composition: 'Diphenhydramine HCl',
    images: [],
  },
];

const CATEGORIES = [
  { label: 'All', value: 'all' },
  { label: 'Tablets', value: 'Tablets' },
  { label: 'Syrups', value: 'Syrups' },
  { label: 'Injections', value: 'Injections' },
  { label: 'Capsules', value: 'Capsules' },
  { label: 'Ointments', value: 'Ointments' },
];

export const useFactoryManageProducts = () => {
  const [products, setProducts] = useState<FactoryProduct[]>(DUMMY_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [newProduct, setNewProduct] = useState<Partial<FactoryProduct>>({
    name: '',
    brand: '',
    category: '',
    price: 0,
    minOrder: 0,
    stock: 0,
    manufacturer: '',
    licenseNumber: '',
    composition: '',
    images: [],
  });

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.manufacturer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Add product
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.brand || !newProduct.category) {
      toast.error('Please fill all required fields');
      return;
    }

    const product: FactoryProduct = {
      id: Date.now().toString(),
      name: newProduct.name!,
      brand: newProduct.brand!,
      category: newProduct.category!,
      price: newProduct.price || 0,
      minOrder: newProduct.minOrder || 0,
      stock: newProduct.stock || 0,
      manufacturer: newProduct.manufacturer || '',
      licenseNumber: newProduct.licenseNumber || '',
      composition: newProduct.composition || '',
      images: newProduct.images || [],
    };

    setProducts([...products, product]);
    toast.success('Product added successfully!');
    setShowAddModal(false);
    resetNewProduct();
  };

  // Reset new product form
  const resetNewProduct = () => {
    setNewProduct({
      name: '',
      brand: '',
      category: '',
      price: 0,
      minOrder: 0,
      stock: 0,
      manufacturer: '',
      licenseNumber: '',
      composition: '',
      images: [],
    });
  };

  // Delete product
  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
    toast.success('Product deleted successfully!');
  };

  // Update product
  const handleUpdateProduct = (updatedProduct: FactoryProduct) => {
    setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
    toast.success('Product updated successfully!');
  };

  // Refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
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
    handleUpdateProduct,
    resetNewProduct,

    // Loading
    loading,
    refreshing,
    handleRefresh,

    // Helpers
    getProductById,
  };
};
