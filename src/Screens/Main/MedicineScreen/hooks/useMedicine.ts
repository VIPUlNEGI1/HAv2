import { useState, useCallback, useMemo } from 'react';
import { useCartStore } from '@/hooks/useCartStore';

const MEDICINES_DATA = [
  { id: '1', name: 'Paracetamol 500mg', brand: 'Dolo', price: 30, image: 'https://5.imimg.com/data5/SELLER/Default/2021/10/XF/XN/XH/139369974/dolo-650-tablet-500x500.jpg', weight: '15 Tablets', category: 'Pain Relief', rating: 4.8 },
  { id: '2', name: 'Amoxicillin 250mg', brand: 'Cipla', price: 120, image: 'https://5.imimg.com/data5/ANDROID/Default/2021/6/YQ/YF/YF/131495932/product-500x500.jpg', weight: '10 Capsules', category: 'Antibiotics', rating: 4.5 },
  { id: '3', name: 'Vitamin C 500mg', brand: 'Limcee', price: 45, image: 'https://5.imimg.com/data5/SELLER/Default/2021/3/XQ/XQ/XQ/12345678/limcee-500mg-tablet-500x500.jpg', weight: '15 Tablets', category: 'Vitamins', rating: 4.9 },
  { id: '4', name: 'Cetirizine 10mg', brand: 'Okacet', price: 25, image: 'https://5.imimg.com/data5/SELLER/Default/2022/1/XQ/XQ/XQ/12345678/okacet-tablet-500x500.jpg', weight: '10 Tablets', category: 'Allergy', rating: 4.2 },
  { id: '5', name: 'Digene Gel Mint', brand: 'Abbott', price: 150, image: 'https://5.imimg.com/data5/SELLER/Default/2021/8/XF/XN/XH/139369974/digene-gel-500x500.jpg', weight: '200ml Liquid', category: 'Stomach', rating: 4.7 },
  { id: '6', name: 'Volini Gel', brand: 'Sun Pharma', price: 95, image: 'https://5.imimg.com/data5/SELLER/Default/2021/10/XF/XN/XH/139369974/volini-gel-500x500.jpg', weight: '30g Tube', category: 'Pain Relief', rating: 4.6 },
];

export const useMedicine = () => {
  const { items, addItem, updateQuantity } = useCartStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [advancedFilters, setAdvancedFilters] = useState<any>({});
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const filteredMedicines = useMemo(() => {
    return MEDICINES_DATA.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           m.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeFilter === 'All' || m.category === activeFilter;
      
      // Advanced filters
      const matchesBrand = !advancedFilters.brand || m.brand === advancedFilters.brand;
      let matchesPrice = true;
      if (advancedFilters.price === 'Under ₹100') matchesPrice = m.price < 100;
      else if (advancedFilters.price === '₹100 - ₹500') matchesPrice = m.price >= 100 && m.price <= 500;
      else if (advancedFilters.price === 'Over ₹500') matchesPrice = m.price > 500;

      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });
  }, [searchQuery, activeFilter, advancedFilters]);

  const cart = useMemo(() => {
    const cartObj: Record<string, number> = {};
    items.forEach(item => { cartObj[item.id] = item.quantity; });
    return cartObj;
  }, [items]);

  const handleUpdateCart = useCallback((id: string, delta: number) => {
    const product = MEDICINES_DATA.find(m => m.id === id);
    if (delta > 0) addItem(product);
    else updateQuantity(id, -1);
  }, [addItem, updateQuantity]);

  return {
    refreshing,
    onRefresh,
    searchQuery,
    setSearchQuery,
    filteredMedicines,
    activeFilter,
    setActiveFilter,
    advancedFilters,
    setAdvancedFilters,
    filterModalVisible,
    setFilterModalVisible,
    cart,
    updateCart: handleUpdateCart,
    filters: ['All', 'Pain Relief', 'Antibiotics', 'Vitamins', 'Allergy', 'Stomach']
  };
};
