import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Download, Share2 } from 'lucide-react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface ActionButtonsProps {
  onDownload: () => void;
  onShare: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onDownload, onShare }) => {
  const { theme, shadows } = useTheme();

  return (
    <Animated.View entering={FadeInDown.delay(900)}>
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.button, styles.downloadButton, { backgroundColor: theme.primary, ...shadows }]}
          onPress={onDownload}
          activeOpacity={0.8}
        >
          <Download size={moderateScale(20)} color="#fff" />
          <Text style={styles.downloadText}>Download Invoice</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.shareButton, { backgroundColor: theme.surface, borderColor: theme.primary, ...shadows }]}
          onPress={onShare}
          activeOpacity={0.8}
        >
          <Share2 size={moderateScale(20)} color={theme.primary} />
          <Text style={[styles.shareText, { color: theme.primary }]}>Share</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: moderateScale(12),
    marginTop: verticalScale(8),
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(16),
    gap: moderateScale(8),
  },
  downloadButton: {},
  shareButton: {
    borderWidth: 2,
  },
  downloadText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
  shareText: {
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
});
