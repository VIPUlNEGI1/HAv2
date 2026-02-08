import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image,
  StatusBar,
} from 'react-native';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { 
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeIn, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

const DoctorAudioCallScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const user = route.params?.user || { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=john' };
  
  const [isMuted, setIsMuted] = useState(false);
  const [isCallActive, setIsCallActive] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withTiming(1.2, { duration: 1000 }),
      -1,
      true
    );
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setTimeout(() => {
      navigation.goBack();
    }, 500);
  };

  const animatedPulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulseAnim.value }],
    };
  });

  return (
    <LinearGradient
      colors={['#4B2A99', '#6366F1', '#8B5CF6']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      
      {/* User Avatar */}
      <Animated.View 
        entering={FadeIn}
        style={[styles.avatarWrapper, animatedPulseStyle]}
      >
        <View style={styles.avatarContainer}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        </View>
      </Animated.View>

      {/* User Info */}
      <Animated.View 
        entering={FadeIn.delay(200)}
        style={styles.userInfoContainer}
      >
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.callStatus}>
          {isCallActive ? 'Call in progress' : 'Call ended'}
        </Text>
        <Text style={styles.callDuration}>{formatDuration(callDuration)}</Text>
      </Animated.View>

      {/* Controls */}
      <Animated.View 
        entering={FadeIn.delay(400)}
        style={styles.controlsContainer}
      >
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
          onPress={() => setIsMuted(!isMuted)}
        >
          {isMuted ? (
            <MicOff size={moderateScale(24)} color="#fff" />
          ) : (
            <Mic size={moderateScale(24)} color="#fff" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
          onPress={() => {}}
        >
          <Volume2 size={moderateScale(24)} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.endCallButton, { backgroundColor: '#EF4444' }]}
          onPress={handleEndCall}
        >
          <PhoneOff size={moderateScale(24)} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  avatar: {
    width: '100%',
    height: '100%',
  },
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: verticalScale(60),
  },
  userName: {
    color: '#fff',
    fontSize: moderateScale(28),
    fontWeight: '900',
    marginBottom: verticalScale(8),
  },
  callStatus: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginBottom: verticalScale(8),
  },
  callDuration: {
    color: '#fff',
    fontSize: moderateScale(20),
    fontWeight: '700',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: moderateScale(24),
  },
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
