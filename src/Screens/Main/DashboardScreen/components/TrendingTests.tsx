import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { ChevronRight, Star } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { moderateScale, verticalScale, SCREEN_WIDTH } from '@/Helpers/Responsive';
import { APICall } from '@/api/client';
import { ApiRoutes } from '@/api/routes';

const FALLBACK_TESTS = [
  { id: '1', title: 'Full Body Checkup', desc: '60+ Tests included', price: 799, oldPrice: 1599, rating: 4.8 },
  { id: '2', title: 'Vitamin D (Total)', desc: 'Bone health check', price: 499, oldPrice: 999, rating: 4.9 },
  { id: '3', title: 'Diabetes Care', desc: 'HbA1c & Glucose', price: 399, oldPrice: 799, rating: 4.7 },
];

export const TrendingTests = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const [tests, setTests] = useState<Array<{ id: string; title: string; desc: string; price: number; oldPrice?: number; rating: number }>>([]);
  const [loading, setLoading] = useState(true);

  const fetchTests = useCallback(async () => {
    setLoading(true);
    const res = await APICall<{ data?: Array<{
      _id?: string;
      id?: string;
      name?: string;
      description?: string;
      price?: number;
      original_price?: number;
      rating?: number;
    }> }>('get', {}, ApiRoutes.labTests.list, {}, undefined);
    if (res.status === 200 && Array.isArray(res.data?.data) && res.data.data.length > 0) {
      setTests(
        res.data.data.slice(0, 5).map((t) => ({
          id: String(t._id ?? t.id ?? ''),
          title: t.name ?? 'Lab Test',
          desc: t.description ?? '',
          price: t.price ?? 0,
          oldPrice: t.original_price,
          rating: t.rating ?? 4.5,
        }))
      );
    } else {
      setTests(FALLBACK_TESTS);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTests();
  }, [fetchTests]);

  return (
    <View style={styles.section}>
      {/* Header */}
      <View style={styles.sectionHeader}>
        <View>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Trending Health Tests
          </Text>
          <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
            Popular checkups in your area
          </Text>
        </View>

        <Pressable
          onPress={() => navigation.navigate('LabTestsScreen')}
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
          <View style={styles.seeAllBtn}>
            <Text style={[styles.seeAllText, { color: theme.primary }]}>
              See All
            </Text>
            <ChevronRight size={moderateScale(16)} color={theme.primary} />
          </View>
        </Pressable>
      </View>

      {/* Cards */}
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={theme.primary} />
        </View>
      ) : (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tests.map(test => (
          <Pressable
            key={test.id}
            onPress={() => navigation.navigate('LabTestDetailsScreen', { test: { id: test.id, _id: test.id, name: test.title, description: test.desc, price: test.price, original_price: test.oldPrice, rating: test.rating } })}
            style={({ pressed }) => [
              styles.trendingCard,
              {
                backgroundColor: theme.surface,
                transform: [{ scale: pressed ? 0.97 : 1 }],
                opacity: pressed ? 0.95 : 1,
              },
            ]}
          >
            <View style={styles.ratingBadge}>
              <Star size={moderateScale(12)} color="#F59E0B" fill="#F59E0B" />
              <Text style={styles.ratingText}>{test.rating}</Text>
            </View>

            <Text
              style={[styles.trendingTitle, { color: theme.text }]}
              numberOfLines={1}
            >
              {test.title}
            </Text>

            <Text
              style={[styles.trendingDesc, { color: theme.textSecondary }]}
              numberOfLines={2}
            >
              {test.desc}
            </Text>

            <View style={styles.bottomRow}>
              <View style={styles.priceContainer}>
                <Text style={[styles.price, { color: theme.text }]}>
                  ₹{test.price}
                </Text>
                {test.oldPrice != null && (
                  <Text style={[styles.oldPrice, { color: theme.textSecondary }]}>
                    ₹{test.oldPrice}
                  </Text>
                )}
              </View>

              <Pressable
                style={({ pressed }) => [
                  styles.addBtn,
                  {
                    backgroundColor: `${theme.primary}15`,
                    transform: [{ scale: pressed ? 0.95 : 1 }],
                  },
                ]}
              >
                <Text style={[styles.addBtnText, { color: theme.primary }]}>
                  ADD
                </Text>
              </Pressable>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loadingWrap: {
    paddingVertical: verticalScale(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginTop: verticalScale(8),
    marginBottom: verticalScale(24),
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: moderateScale(16),
    marginBottom: verticalScale(16),
  },

  sectionTitle: {
    fontSize: moderateScale(20),
    fontWeight: '900',
    letterSpacing: 0.2,
  },

  sectionSubtitle: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    marginTop: verticalScale(2),
  },

  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(2),
  },

  seeAllText: {
    fontSize: moderateScale(14),
    fontWeight: '800',
  },

  scrollContent: {
    paddingHorizontal: moderateScale(16),
    gap: moderateScale(12),
  },

  trendingCard: {
    width: SCREEN_WIDTH * 0.7,
    borderRadius: moderateScale(20),
    padding: moderateScale(16),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },

  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    alignSelf: 'flex-start',
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(7),
    borderRadius: moderateScale(6),
    gap: moderateScale(4),
    marginBottom: verticalScale(10),
  },

  ratingText: {
    fontSize: moderateScale(12),
    fontWeight: '800',
    color: '#B45309',
  },

  trendingTitle: {
    fontSize: moderateScale(15),
    fontWeight: '800',
  },

  trendingDesc: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    marginTop: verticalScale(4),
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(16),
  },

  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
  },

  price: {
    fontSize: moderateScale(16),
    fontWeight: '900',
  },

  oldPrice: {
    fontSize: moderateScale(12),
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },

  addBtn: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(10),
  },

  addBtnText: {
    fontSize: moderateScale(12),
    fontWeight: '900',
  },
});