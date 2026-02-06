import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { PlayCircle, BookOpen, Info } from 'lucide-react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';

const WellnessScreen = () => {
  const { theme, shadows } = useTheme();

  return (
    <ScreenWrapper
      title="Health Awareness"
      showBack={true}
      scrollable={true}
      contentStyle={styles.scroll}
    >
      {/* Video Section */}
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Educational Videos</Text>
      <Animated.View entering={FadeInDown.delay(100)} style={[styles.videoCard, { backgroundColor: theme.surface, ...shadows }]}>
        <Image source={{ uri: 'https://img.freepik.com/free-vector/medical-video-consultation-concept_23-2148524331.jpg' }} style={styles.videoThumb} />
        <View style={styles.playOverlay}>
          <PlayCircle size={48} color="#fff" />
        </View>
        <View style={styles.videoInfo}>
          <Text style={[styles.videoTitle, { color: theme.text }]}>How to maintain healthy heart?</Text>
          <Text style={[styles.videoAuthor, { color: theme.primary }]}>by Dr. Arpita Shah</Text>
        </View>
      </Animated.View>

      {/* Articles */}
      <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 24 }]}>Read & Learn</Text>
      {[1, 2].map((_, i) => (
        <Animated.View key={i} entering={FadeInDown.delay(200 + i * 100)} style={[styles.articleCard, { backgroundColor: theme.surface, ...shadows }]}>
          <View style={[styles.articleIcon, { backgroundColor: theme.accent }]}>
            <BookOpen size={24} color={theme.primary} />
          </View>
          <View style={styles.articleInfo}>
            <Text style={[styles.articleTitle, { color: theme.text }]}>10 Tips for Daily Wellness</Text>
            <Text style={[styles.articleDesc, { color: theme.textSecondary }]}>Simple habits that can change your life...</Text>
          </View>
        </Animated.View>
      ))}

      {/* FAQ Section */}
      <TouchableOpacity style={[styles.faqCard, { backgroundColor: theme.primary }]}>
        <Info size={24} color="#fff" />
        <Text style={styles.faqText}>Have questions? Check our Health Wiki</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '900', marginBottom: 16 },
  videoCard: { borderRadius: 24, overflow: 'hidden', marginBottom: 16 },
  videoThumb: { width: '100%', height: 180 },
  playOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' },
  videoInfo: { padding: 16 },
  videoTitle: { fontSize: 16, fontWeight: '800' },
  videoAuthor: { fontSize: 12, fontWeight: '700', marginTop: 4 },
  articleCard: { flexDirection: 'row', padding: 16, borderRadius: 20, marginBottom: 12, alignItems: 'center' },
  articleIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  articleInfo: { flex: 1, marginLeft: 16 },
  articleTitle: { fontSize: 15, fontWeight: '800' },
  articleDesc: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  faqCard: { flexDirection: 'row', alignItems: 'center', padding: 20, borderRadius: 20, marginTop: 12, gap: 12 },
  faqText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});

export default WellnessScreen;
