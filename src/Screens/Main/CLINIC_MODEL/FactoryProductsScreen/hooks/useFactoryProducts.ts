import { useState, useMemo } from 'react';

export interface FactoryProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  minOrder: number;
  images?: string[];
  image?: string;
  category: string;
  weight: string;
  manufacturer: string;
  licenseNumber: string;
  composition?: string;
  usage?: string;
  stock: number;
}

export interface Factory {
  id: string;
  name: string;
  location?: string;
}

const MOCK_PRODUCTS: FactoryProduct[] = [
  {
    id: '1',
    name: 'Paracetamol 500mg',
    brand: 'Dolo',
    price: 20,
    minOrder: 100,
    category: 'Pain Relief',
    weight: '15 Tablets',
    manufacturer: 'Micro Labs',
    licenseNumber: 'DL-2024-001',
    composition: 'Paracetamol IP 500mg',
    usage: 'Pain relief, Fever reduction',
    stock: 5000,
    images: [],
  },
  {
    id: '2',
    name: 'Amoxicillin 250mg',
    brand: 'Cipla',
    price: 35,
    minOrder: 50,
    category: 'Antibiotic',
    weight: '10 Capsules',
    manufacturer: 'Cipla Ltd',
    licenseNumber: 'DL-2024-002',
    composition: 'Amoxicillin Trihydrate 250mg',
    usage: 'Bacterial infections',
    stock: 3000,
    images: [],
  },
  {
    id: '3',
    name: 'Vitamin C 500mg',
    brand: 'Limcee',
    price: 30,
    minOrder: 200,
    category: 'Vitamins',
    weight: '15 Tablets',
    manufacturer: 'Abbott',
    licenseNumber: 'DL-2024-003',
    stock: 8000,
    images: [],
  },
];

export const useFactoryProducts = (factory: Factory, searchQuery: string) => {
  const [cart, setCart] = useState<Record<string, number>>({});

  const products = MOCK_PRODUCTS;

  const filteredProducts = useMemo(
    () =>
      products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const totalUnits = useMemo(
    () => Object.values(cart).reduce((sum, qty) => sum + qty, 0),
    [cart]
  );

  const handleAddToCart = (product: FactoryProduct) => {
    const currentQty = cart[product.id] || 0;
    if (currentQty + product.minOrder > product.stock) return false;
    setCart((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + product.minOrder,
    }));
    return true;
  };

  const handleUpdateQuantity = (productId: string, delta: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const currentQty = cart[productId] || 0;
    const newQty = Math.max(0, Math.min(currentQty + delta, product.stock));
    if (newQty > 0 && newQty < product.minOrder) return;
    setCart((prev) => ({ ...prev, [productId]: newQty }));
  };

  return {
    products: filteredProducts,
    allProducts: products,
    cart,
    totalUnits,
    handleAddToCart,
    handleUpdateQuantity,
  };
};
