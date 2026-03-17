import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Activity, Heart, ArrowRight } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';

export const QuickActionCards = () => {
  const navigation = useNavigation<any>();

  const renderCard = ({
    onPress,
    colors,
    icon,
    title,
    desc,
    titleColor,
    descColor,
    arrowColor,
  }: any) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.cardWrapper,
        {
          transform: [
            { scale: pressed ? 0.97 : 1 },
            { translateY: pressed ? 2 : 0 },
          ],
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      <View style={styles.quickCardShadow}>
        <LinearGradient colors={colors} style={styles.quickCard}>
        <View style={styles.topRow}>
          <View style={styles.quickIcon}>{icon}</View>
        </View>

        <View style={styles.cardContent}>
          <Text style={[styles.quickTitle, { color: titleColor }]}>
            {title}
          </Text>
          <Text style={[styles.quickDesc, { color: descColor }]}>
            {desc}
          </Text>
        </View>

        <ArrowRight size={moderateScale(16)} color={arrowColor} />
        </LinearGradient>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.quickActionRow}>
      {renderCard({
        onPress: () => navigation.navigate('LabTestsScreen'),
        colors: ['#E0F2FE', '#BAE6FD'],
        icon: <Activity size={moderateScale(22)} color="#0288D1" />,
        title: 'Lab Tests',
        desc: 'Book at home',
        titleColor: '#0369A1',
        descColor: '#075985',
        arrowColor: '#0369A1',
      })}

      {renderCard({
        onPress: () => navigation.navigate('WellnessScreen'),
        colors: ['#FEF3C7', '#FDE68A'],
        icon: <Heart size={moderateScale(22)} color="#D97706" />,
        title: 'Wellness',
        desc: 'Health tips',
        titleColor: '#92400E',
        descColor: '#78350F',
        arrowColor: '#92400E',
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  quickActionRow: {
    flexDirection: 'row',
  },

  cardWrapper: {
    flex: 1,
  },

  quickCardShadow: {
    borderRadius: moderateScale(24),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    backgroundColor: 'transparent',
  },

  quickCard: {
    padding: moderateScale(16),
    borderRadius: moderateScale(24),
    aspectRatio: 1,
    justifyContent: 'space-between',
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  quickIcon: {
    width: moderateScale(44),
    height: moderateScale(44),
    borderRadius: moderateScale(14),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardContent: {
    marginTop: verticalScale(10),
  },

  quickTitle: {
    fontSize: moderateScale(16),
    fontWeight: '800',
    letterSpacing: 0.3,
  },

  quickDesc: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    marginTop: verticalScale(4),
    opacity: 0.85,
  },
});