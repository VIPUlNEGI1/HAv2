import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

const { width } = Dimensions.get('window');

interface ProductImageCarouselProps {
  images: string[];
}

export const ProductImageCarousel: React.FC<ProductImageCarouselProps> = ({ images }) => {
  const { theme } = useTheme();

  if (images.length === 0) {
    return (
      <View style={[styles.noImageContainer, { backgroundColor: theme.border }]}>
        <Text style={[styles.noImageText, { color: theme.textSecondary }]}>No images added</Text>
      </View>
    );
  }

  return (
    <View style={styles.carouselContainer}>
      <FlatList
        data={images}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.imageWrapper}>
            <Image source={{ uri: item }} style={styles.mainImage} />
          </View>
        )}
      />
      <View style={styles.imageIndicator}>
        <Text style={styles.imageCount}>{images.length} / 4</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  carouselContainer: {
    height: verticalScale(300),
    position: 'relative',
  },
  imageWrapper: {
    width: width,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
  },
  mainImage: {
    width: width * 0.8,
    height: verticalScale(300),
    resizeMode: 'contain',
  },
  imageIndicator: {
    position: 'absolute',
    bottom: moderateScale(16),
    right: moderateScale(16),
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(12),
  },
  imageCount: {
    color: '#fff',
    fontSize: moderateScale(12),
    fontWeight: '700',
  },
  noImageContainer: {
    height: verticalScale(200),
    justifyContent: 'center',
    alignItems: 'center',
    margin: moderateScale(16),
    borderRadius: moderateScale(16),
  },
  noImageText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
});
