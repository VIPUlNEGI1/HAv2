import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { MessageSquare, Search, Send, Video, Phone, ArrowLeft } from 'lucide-react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useDoctorChat, type DoctorChatUser } from './hooks/useDoctorChat';
import { ChatUserCard } from './components/ChatUserCard';

const DoctorChatScreen = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [selectedUser, setSelectedUser] = useState<DoctorChatUser | null>(route.params?.user || null);
  const { messages, searchQuery, setSearchQuery, filteredUsers, onSend } = useDoctorChat(selectedUser);

  if (selectedUser) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={[styles.chatHeader, { backgroundColor: theme.surface, ...shadows }]}>
          <TouchableOpacity onPress={() => setSelectedUser(null)} style={styles.backBtn}>
            <ArrowLeft size={moderateScale(24)} color={theme.text} />
          </TouchableOpacity>
          <Image source={{ uri: selectedUser.avatar }} style={styles.chatHeaderAvatar} />
          <View style={styles.chatHeaderInfo}>
            <Text style={[styles.chatHeaderName, { color: theme.text }]}>{selectedUser.name}</Text>
            <Text style={[styles.chatHeaderStatus, { color: theme.textSecondary }]}>Online</Text>
          </View>
          <View style={styles.chatHeaderActions}>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: theme.primary + '15' }]}
              onPress={() => navigation.navigate('DoctorVideoCallScreen', { user: selectedUser })}
            >
              <Video size={moderateScale(20)} color={theme.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: theme.primary + '15' }]}
              onPress={() => navigation.navigate('DoctorAudioCallScreen', { user: selectedUser })}
            >
              <Phone size={moderateScale(20)} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{ _id: 'doctor', name: 'Dr. Smith' }}
          renderSend={(props) => (
            <View style={styles.sendContainer}>
              <TouchableOpacity
                onPress={() => props.text && props.onSend && props.onSend([{ text: props.text.trim() }], true)}
                style={[styles.sendButton, { backgroundColor: theme.primary }]}
              >
                <Send size={moderateScale(20)} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
          placeholder="Type a message..."
          alwaysShowSend
          scrollToBottom
          scrollToBottomComponent={() => null}
          renderAvatar={() => null}
          showUserAvatar={false}
          textInputStyle={[styles.textInput, { color: theme.text }]}
          containerStyle={{ backgroundColor: theme.background }}
          messagesContainerStyle={{ backgroundColor: theme.background }}
          renderBubble={(props) => (
            <View
              style={[
                styles.bubble,
                {
                  backgroundColor: props.currentMessage?.user._id === 'doctor' ? theme.primary : theme.surface,
                  marginRight: props.currentMessage?.user._id === 'doctor' ? 0 : moderateScale(40),
                  marginLeft: props.currentMessage?.user._id === 'doctor' ? moderateScale(40) : 0,
                },
              ]}
            >
              <Text style={[styles.bubbleText, { color: props.currentMessage?.user._id === 'doctor' ? '#fff' : theme.text }]}>
                {props.currentMessage?.text}
              </Text>
            </View>
          )}
        />
      </View>
    );
  }

  return (
    <ScreenWrapper title="Chat" showBack={true} scrollable={false}>
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.surface, ...shadows }]}>
          <Search size={moderateScale(18)} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search patients..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>
      <FlatList
        data={filteredUsers}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 50)}>
            <ChatUserCard item={item} onPress={() => setSelectedUser(item)} />
          </Animated.View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MessageSquare size={moderateScale(48)} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No scheduled patients found</Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchContainer: { padding: moderateScale(16) },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: moderateScale(16), paddingVertical: verticalScale(12), borderRadius: moderateScale(16), gap: moderateScale(12) },
  searchInput: { flex: 1, fontSize: moderateScale(14), fontWeight: '500' },
  listContent: { padding: moderateScale(16), paddingTop: 0 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: verticalScale(60) },
  emptyText: { fontSize: moderateScale(14), fontWeight: '500', marginTop: verticalScale(12) },
  chatHeader: { flexDirection: 'row', alignItems: 'center', padding: moderateScale(16), gap: moderateScale(12) },
  backBtn: { padding: moderateScale(4) },
  chatHeaderAvatar: { width: moderateScale(40), height: moderateScale(40), borderRadius: moderateScale(20) },
  chatHeaderInfo: { flex: 1 },
  chatHeaderName: { fontSize: moderateScale(16), fontWeight: '700' },
  chatHeaderStatus: { fontSize: moderateScale(12), fontWeight: '500', marginTop: verticalScale(2) },
  chatHeaderActions: { flexDirection: 'row', gap: moderateScale(8) },
  actionBtn: { width: moderateScale(40), height: moderateScale(40), borderRadius: moderateScale(20), justifyContent: 'center', alignItems: 'center' },
  sendContainer: { flexDirection: 'row', alignItems: 'center', paddingRight: moderateScale(8) },
  sendButton: { width: moderateScale(40), height: moderateScale(40), borderRadius: moderateScale(20), justifyContent: 'center', alignItems: 'center' },
  textInput: { fontSize: moderateScale(14), fontWeight: '500' },
  bubble: { paddingHorizontal: moderateScale(16), paddingVertical: verticalScale(10), borderRadius: moderateScale(20), maxWidth: '75%' },
  bubbleText: { fontSize: moderateScale(14), fontWeight: '500' },
});

export default DoctorChatScreen;
