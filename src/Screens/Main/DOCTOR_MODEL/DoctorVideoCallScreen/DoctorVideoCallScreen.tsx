import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { PhoneOff, Video, VideoOff, Mic, MicOff, User } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useDoctorVideoCall } from './hooks/useDoctorVideoCall';

const DoctorVideoCallScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const user = route.params?.user;
  const {
    user: callUser,
    isMuted,
    isVideoOff,
    isCallActive,
    handleEndCall,
    toggleMute,
    toggleVideo,
  } = useDoctorVideoCall(user, () => navigation.goBack());

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      <StatusBar barStyle="light-content" />
      <View style={styles.remoteVideoContainer}>
        {isVideoOff ? (
          <View style={styles.avatarContainer}>
            <Image source={{ uri: callUser.avatar }} style={styles.avatar} />
            <Text style={styles.userName}>{callUser.name}</Text>
          </View>
        ) : (
          <View style={styles.videoPlaceholder}>
            <Text style={styles.videoText}>Video Call</Text>
          </View>
        )}
      </View>
      {!isVideoOff && (
        <Animated.View entering={FadeIn} exiting={FadeOut} style={styles.localVideoContainer}>
          <View style={styles.localVideoPlaceholder}>
            <User size={moderateScale(24)} color="#fff" />
          </View>
        </Animated.View>
      )}
      <Animated.View entering={FadeIn.delay(200)} style={styles.callInfoContainer}>
        <Text style={styles.callStatus}>
          {isCallActive ? 'Call in progress' : 'Call ended'}
        </Text>
        <Text style={styles.callDuration}>05:32</Text>
      </Animated.View>
      <Animated.View entering={FadeIn.delay(400)} style={styles.controlsContainer}>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
          onPress={toggleMute}
        >
          {isMuted ? <MicOff size={moderateScale(24)} color="#fff" /> : <Mic size={moderateScale(24)} color="#fff" />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}
          onPress={toggleVideo}
        >
          {isVideoOff ? <VideoOff size={moderateScale(24)} color="#fff" /> : <Video size={moderateScale(24)} color="#fff" />}
        </TouchableOpacity>
        <TouchableOpacity style={[styles.endCallButton, { backgroundColor: '#EF4444' }]} onPress={handleEndCall}>
          <PhoneOff size={moderateScale(24)} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  remoteVideoContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  videoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoText: { color: '#fff', fontSize: moderateScale(18), fontWeight: '600' },
  avatarContainer: { alignItems: 'center' },
  avatar: { width: moderateScale(120), height: moderateScale(120), borderRadius: moderateScale(60) },
  userName: { color: '#fff', fontSize: moderateScale(20), fontWeight: '700', marginTop: verticalScale(16) },
  localVideoContainer: {
    position: 'absolute',
    top: moderateScale(60),
    right: moderateScale(20),
    width: moderateScale(120),
    height: moderateScale(160),
    borderRadius: moderateScale(12),
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#fff',
  },
  localVideoPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callInfoContainer: { position: 'absolute', top: moderateScale(40), left: 0, right: 0, alignItems: 'center' },
  callStatus: { color: '#fff', fontSize: moderateScale(14), fontWeight: '600' },
  callDuration: { color: '#fff', fontSize: moderateScale(16), fontWeight: '700', marginTop: verticalScale(4) },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: verticalScale(40),
    gap: moderateScale(20),
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

export default DoctorVideoCallScreen;
