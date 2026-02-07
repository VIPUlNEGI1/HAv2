import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView, Modal, ImageBackground } from 'react-native';
import { GiftedChat, Bubble, InputToolbar, Send, Time } from 'react-native-gifted-chat';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useChat } from '../hook/usechat';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useTheme } from '@/Theme/useTheme';
import { Phone, Video, Paperclip, X, Mic, Camera, Smile, Send as SendIcon } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { theme, isDarkMode } = useTheme();
  const { receiver } = route.params;
  const currentUser = useAuthStore((state) => state.user);
  const { messages, sendMessage, pickImage } = useChat(currentUser, receiver);
  const [callModalVisible, setCallModalVisible] = React.useState(false);
  const [callType, setCallType] = React.useState<'audio' | 'video'>('audio');

  const onBack = () => navigation.goBack();

  const startCall = (type: 'audio' | 'video') => {
    setCallType(type);
    setCallModalVisible(true);
  };

  const renderBubble = (props: any) => (
    <Bubble
      {...props}
      wrapperStyle={{
        right: { 
          backgroundColor: theme.primary, 
          borderRadius: 20, 
          borderBottomRightRadius: 4,
          padding: 2,
          elevation: 2,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        left: { 
          backgroundColor: theme.surface, 
          borderRadius: 20, 
          borderBottomLeftRadius: 4,
          padding: 2,
          elevation: 1,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 2,
        }
      }}
      textStyle={{ 
        right: { color: '#fff', fontSize: 15, fontWeight: '500' }, 
        left: { color: theme.text, fontSize: 15, fontWeight: '500' } 
      }}
    />
  );

  const renderTime = (props: any) => (
    <Time
      {...props}
      timeTextStyle={{
        right: { color: 'rgba(255,255,255,0.7)', fontSize: 10 },
        left: { color: theme.textSecondary, fontSize: 10 },
      }}
    />
  );

  const renderInputToolbar = (props: any) => (
    <InputToolbar
      {...props}
      containerStyle={[styles.inputToolbar, { backgroundColor: theme.surface, borderTopColor: theme.border }]}
      primaryStyle={{ alignItems: 'center', paddingHorizontal: 8 }}
    />
  );

  const renderActions = () => (
    <View style={styles.actionsRow}>
      <TouchableOpacity style={styles.actionBtn}>
        <Smile size={24} color={theme.textSecondary} />
      </TouchableOpacity>
      <TouchableOpacity onPress={pickImage} style={styles.actionBtn}>
        <Paperclip size={22} color={theme.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  const renderSend = (props: any) => (
    <Send {...props} containerStyle={styles.sendContainer}>
      <LinearGradient
        colors={[theme.primary, theme.primary + 'DD']}
        style={styles.sendButton}
      >
        <SendIcon size={20} color="#fff" />
      </LinearGradient>
    </Send>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.surface }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={[styles.backText, { color: theme.primary }]}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={[styles.headerName, { color: theme.text }]}>{receiver?.name || 'Doctor'}</Text>
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: '#4BC016' }]} />
            <Text style={styles.headerStatus}>Online</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => startCall('audio')} style={[styles.iconBtn, { backgroundColor: theme.background }]}>
            <Phone size={18} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => startCall('video')} style={[styles.iconBtn, { backgroundColor: theme.background }]}>
            <Video size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <ImageBackground 
        source={{ uri: isDarkMode ? 'https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png' : 'https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png' }}
        style={styles.chatBackground}
        imageStyle={{ opacity: isDarkMode ? 0.05 : 0.08, tintColor: isDarkMode ? '#fff' : theme.primary }}
      >
        <View style={styles.chatContainer}>
          <GiftedChat
            messages={messages}
            onSend={msgs => sendMessage(msgs)}
            user={{
              _id: currentUser?.id || '',
              name: currentUser?.name || '',
              // avatar: currentUser?.avatar_url
            }}
            renderBubble={renderBubble}
            renderTime={renderTime}
            renderInputToolbar={renderInputToolbar}
            renderActions={renderActions}
            renderSend={renderSend}
            // scrollToBottom
            // infiniteScroll
            // placeholder="Type a message..."
            // alwaysShowSend
          />
        </View>
      </ImageBackground>

      {/* Call UI Mockup */}
      <Modal visible={callModalVisible} transparent animationType="fade">
        <View style={styles.callOverlay}>
          <LinearGradient colors={['#1a1a1a', '#000']} style={styles.callContent}>
            <View style={styles.callHeader}>
              <Text style={styles.callingText}>{callType === 'audio' ? 'Audio Calling...' : 'Video Calling...'}</Text>
              <Text style={styles.callName}>{receiver?.name}</Text>
            </View>
            
            <View style={styles.callAvatarContainer}>
              <View style={[styles.callAvatarWrapper, { borderColor: theme.primary }]}>
                <Text style={styles.callAvatarInitial}>{receiver?.name?.charAt(0)}</Text>
              </View>
            </View>

            <View style={styles.callActions}>
              <TouchableOpacity style={styles.callActionBtn}>
                <Mic size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => setCallModalVisible(false)} 
                style={[styles.callActionBtn, { backgroundColor: '#EF4444' }]}
              >
                <X size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.callActionBtn}>
                <Camera size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 8,
    borderBottomWidth: 1,
  },
  backButton: { paddingRight: 12 },
  backText: { fontSize: 24 },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 17, fontWeight: '800' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  headerStatus: { fontSize: 12, color: '#4BC016', fontWeight: '700' },
  headerActions: { flexDirection: 'row', gap: 12 },
  iconBtn: { width: 38, height: 38, borderRadius: 19, justifyContent: 'center', alignItems: 'center' },
  chatBackground: { flex: 1, backgroundColor: '#E5DDD5' },
  chatContainer: { flex: 1 },
  inputToolbar: {
    marginHorizontal: 8,
    marginBottom: 8,
    borderRadius: 24,
    borderTopWidth: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionsRow: { flexDirection: 'row', alignItems: 'center', marginLeft: 4 },
  actionBtn: { padding: 8 },
  sendContainer: { justifyContent: 'center', alignItems: 'center', alignSelf: 'center', paddingRight: 4 },
  sendButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  callOverlay: { flex: 1 },
  callContent: { flex: 1, justifyContent: 'space-around', alignItems: 'center', paddingVertical: 80 },
  callHeader: { alignItems: 'center' },
  callingText: { color: '#ccc', fontSize: 16, fontWeight: '600', marginBottom: 8 },
  callName: { color: '#fff', fontSize: 32, fontWeight: '900' },
  callAvatarContainer: { width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  callAvatarWrapper: { width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', borderWidth: 2 },
  callAvatarInitial: { color: '#fff', fontSize: 56, fontWeight: '900' },
  callActions: { flexDirection: 'row', gap: 32, alignItems: 'center' },
  callActionBtn: { width: 68, height: 68, borderRadius: 34, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
});

export default ChatScreen;
