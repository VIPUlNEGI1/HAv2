import { useState, useCallback, useMemo, useEffect } from 'react';
import { useCartStore } from '@/hooks/useCartStore';
import { APICall } from '@/api/client';
import { ApiRoutes } from '@/api/routes';

const FALLBACK_MEDICINES = [
  { id: '1', name: 'Paracetamol 500mg', brand: 'Dolo', price: 30, image: 'https://5.imimg.com/data5/SELLER/Default/2021/10/XF/XN/XH/139369974/dolo-650-tablet-500x500.jpg', weight: '15 Tablets', category: 'Pain Relief', rating: 4.8 },
  { id: '2', name: 'Amoxicillin 250mg', brand: 'Cipla', price: 120, image: 'https://5.imimg.com/data5/ANDROID/Default/2021/6/YQ/YF/YF/131495932/product-500x500.jpg', weight: '10 Capsules', category: 'Antibiotics', rating: 4.5 },
  { id: '3', name: 'Vitamin C 500mg', brand: 'Limcee', price: 45, image: 'https://5.imimg.com/data5/SELLER/Default/2021/3/XQ/XQ/XQ/12345678/limcee-500mg-tablet-500x500.jpg', weight: '15 Tablets', category: 'Vitamins', rating: 4.9 },
];

type MedicineItem = {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  weight: string;
  category: string;
  rating: number;
};

export const useMedicine = () => {
  const { items, addItem, updateQuantity } = useCartStore();
  const [medicines, setMedicines] = useState<MedicineItem[]>(FALLBACK_MEDICINES);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [advancedFilters, setAdvancedFilters] = useState<any>({});
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    const params: Record<string, string> = { limit: '100' };
    const res = await APICall<{ data?: Array<{
      _id?: string;
      name?: string;
      brand?: string;
      category?: string;
      price?: number;
      images?: string[];
      weight?: string;
      rating?: number;
    }> }>('get', params, ApiRoutes.medicines.list, {}, undefined);

    if (res.status === 200 && Array.isArray(res.data?.data) && res.data.data.length > 0) {
      setMedicines(
        res.data.data.map((m) => ({
          id: String(m._id ?? ''),
          name: m.name ?? 'Medicine',
          brand: m.brand ?? '',
          price: Number(m.price ?? 0),
          image: Array.isArray(m.images) && m.images[0] ? m.images[0] : 'https://5.imimg.com/data5/SELLER/Default/2021/10/XF/XN/XH/139369974/dolo-650-tablet-500x500.jpg',
          weight: m.weight ?? '',
          category: m.category ?? 'General',
          rating: Number(m.rating ?? 4.5),
        }))
      );
    } else {
      setMedicines(FALLBACK_MEDICINES);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchMedicines();
    setRefreshing(false);
  }, [fetchMedicines]);

  const filteredMedicines = useMemo(() => {
    return medicines.filter((m) => {
      const matchesSearch =
        !searchQuery.trim() ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeFilter === 'All' || m.category === activeFilter;
      const matchesBrand = !advancedFilters.brand || m.brand === advancedFilters.brand;
      let matchesPrice = true;
      if (advancedFilters.price === 'Under ₹100') matchesPrice = m.price < 100;
      else if (advancedFilters.price === '₹100 - ₹500') matchesPrice = m.price >= 100 && m.price <= 500;
      else if (advancedFilters.price === 'Over ₹500') matchesPrice = m.price > 500;
      return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
    });
  }, [medicines, searchQuery, activeFilter, advancedFilters]);

  const cart = useMemo(() => {
    const cartObj: Record<string, number> = {};
    items.forEach((item) => {
      cartObj[item.id] = item.quantity;
    });
    return cartObj;
  }, [items]);

  const handleUpdateCart = useCallback(
    (id: string, delta: number) => {
      const product = medicines.find((m) => m.id === id);
      if (product) {
        if (delta > 0) addItem(product);
        else updateQuantity(id, -1);
      }
    },
    [addItem, updateQuantity, medicines]
  );

  const filters = useMemo(() => {
    const cats = Array.from(new Set(medicines.map((m) => m.category).filter(Boolean)));
    return ['All', ...cats.sort()];
  }, [medicines]);

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
    filters: filters.length > 1 ? filters : ['All', 'Pain Relief', 'Antibiotics', 'Vitamins', 'Allergy', 'Stomach'],
    loading,
  };
};
