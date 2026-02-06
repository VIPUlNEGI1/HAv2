import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Image,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { moderateScale, verticalScale, SCREEN_WIDTH } from '@/Helpers/Responsive';

const CARD_WIDTH = SCREEN_WIDTH * .97;
const CARD_HEIGHT = verticalScale(190);

export const OfferSlider = ({ offers }: { offers: any[] }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={offers}
        horizontal
        pagingEnabled
        snapToInterval={CARD_WIDTH + moderateScale(16)}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bannerList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.bannerWrapper}>
   
<Pressable
  onPress={() => console.log('Offer pressed:', item.id)}
  style={({ pressed }) => [
    styles.pressable,
    pressed && styles.pressed,
  ]}
>
  <ImageBackground
    source={{ uri: item.image }}
    resizeMode="cover"
    style={styles.bannerCard}
    imageStyle={styles.bannerImageBg}
  >
    
      {/* CONTENT */}
      <View style={styles.bannerInfo}>
        <View style={styles.tagContainer}>
          <Text style={styles.tagText}>LIMITED OFFER</Text>
        </View>

        <Text style={styles.bannerTitle} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>
            {item.subtitle}
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.shopNowBtn}
          onPress={() => console.log('Shop Now pressed:', item.id)}
        >
          <Text style={styles.shopNowText}>Shop Now</Text>
        </TouchableOpacity>
      </View>
     
  </ImageBackground>
</Pressable>
          </View>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  bannerCard: {
    height: CARD_HEIGHT,
    borderRadius: moderateScale(20),
    overflow: 'hidden',
  
    // shadows
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  
  bannerImageBg: {
    borderRadius: moderateScale(20),
  },
  
  overlay: {
    flex: 1,
    padding: moderateScale(16),
    justifyContent: 'center',
  },
  
  bannerInfo: {
    maxWidth: '75%',
    marginTop: verticalScale(20),
    marginLeft: moderateScale(20),
  },
  
  pressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.95,
  },
  container: {
    marginTop: verticalScale(12),
  },

  bannerList: {
    paddingHorizontal: moderateScale(5),
  },

  bannerWrapper: {
    width: CARD_WIDTH,
    marginRight: moderateScale(16),
  },

  pressable: {
    flex: 1,
  },

  

 
 

  tagContainer: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignSelf: 'flex-start',
    paddingHorizontal: moderateScale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(8),
    marginBottom: verticalScale(8),
  },

  tagText: {
    color: '#fff',
    fontSize: moderateScale(10),
    fontWeight: '800',
    letterSpacing: 0.6,
  },

  bannerTitle: {
    fontSize: moderateScale(20),
    fontWeight: '900',
    color: '#fff',
    lineHeight: moderateScale(26),
  },

  discountBadge: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(10),
    marginTop: verticalScale(8),
  },

  discountText: {
    fontSize: moderateScale(14),
    fontWeight: '800',
    color: '#fff',
  },

  shopNowBtn: {
    marginTop: verticalScale(16),
    backgroundColor: '#fff',
    paddingHorizontal: moderateScale(18),
    paddingVertical: verticalScale(9),
    borderRadius: moderateScale(12),
    alignSelf: 'flex-start',
  },

  shopNowText: {
    color: '#000',
    fontSize: moderateScale(13),
    fontWeight: '800',
  },

  imageContainer: {
    flex: 0.9,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },

  bannerImage: {
    width: '100%',
    height: '100%',
    maxWidth: moderateScale(130),
    maxHeight: moderateScale(130),
    resizeMode: 'contain',
  },
});
