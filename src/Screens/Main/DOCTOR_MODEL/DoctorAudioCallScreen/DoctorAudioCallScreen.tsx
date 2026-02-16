import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { PhoneOff, Mic, MicOff, Volume2 } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { useDoctorAudioCall } from './hooks/useDoctorAudioCall';

const DoctorAudioCallScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const user = route.params?.user;
  const {
    user: callUser,
    isMuted,
    isCallActive,
    callDuration,
    formatDuration,
    handleEndCall,
    toggleMute,
  } = useDoctorAudioCall(user, () => navigation.goBack());

  const pulseAnim = useSharedValue(1);
  useEffect(() => {
    pulseAnim.value = withRepeat(withTiming(1.2, { duration: 1000 }), -1, true);
  }, []);

  const animatedPulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  return (
    <LinearGradient colors={['#4B2A99', '#6366F1', '#8B5CF6']} style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View entering={FadeIn} style={[styles.avatarWrapper, animatedPulseStyle]}>
        <View style={styles.avatarContainer}>
          <Image source={{ uri: callUser.avatar }} style={styles.avatar} />
        </View>
      </Animated.View>
      <Animated.View entering={FadeIn.delay(200)} style={styles.userInfoContainer}>
        <Text style={styles.userName}>{callUser.name}</Text>
        <Text style={styles.callStatus}>{isCallActive ? 'Call in progress' : 'Call ended'}</Text>
        <Text style={styles.callDuration}>{formatDuration(callDuration)}</Text>
      </Animated.View>
      <Animated.View entering={FadeIn.delay(400)} style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
          onPress={toggleMute}
        >
          {isMuted ? <MicOff size={moderateScale(24)} color="#fff" /> : <Mic size={moderateScale(24)} color="#fff" />}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
          <Volume2 size={moderateScale(24)} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.endCallButton, { backgroundColor: '#EF4444' }]} onPress={handleEndCall}>
          <PhoneOff size={moderateScale(24)} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  avatarWrapper: {
    width: moderateScale(200),
    height: moderateScale(200),
    borderRadius: moderateScale(100),
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(40),
  },
  avatarContainer: {
    width: moderateScale(180),
    height: moderateScale(180),
    borderRadius: moderateScale(90),
    overflow: 'hidden',
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatar: { width: '100%', height: '100%' },
  userInfoContainer: { alignItems: 'center', marginBottom: verticalScale(60) },
  userName: { color: '#fff', fontSize: moderateScale(28), fontWeight: '900', marginBottom: verticalScale(8) },
  callStatus: { color: 'rgba(255,255,255,0.9)', fontSize: moderateScale(16), fontWeight: '600', marginBottom: verticalScale(8) },
  callDuration: { color: '#fff', fontSize: moderateScale(20), fontWeight: '700' },
  controlsContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: moderateScale(24) },
  controlButton: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(28),
    justifyContent: 'center',
    alignItems: 'center',
  },
  endCallButton: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DoctorAudioCallScreen;
