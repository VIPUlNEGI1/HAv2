import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { ArrowLeft, Building2, Send } from 'lucide-react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import type { ChatUser } from '../hooks/useFactoryChat';

interface ChatViewProps {
  user: ChatUser;
  messages: IMessage[];
  onBack: () => void;
  onSend: (messages: IMessage[]) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({ user, messages, onBack, onSend }) => {
  const { theme, shadows } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Chat Header */}
      <View style={[styles.header, { backgroundColor: theme.surface, ...shadows }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <ArrowLeft size={moderateScale(24)} color={theme.text} />
        </TouchableOpacity>
        <View style={[styles.avatarContainer, { backgroundColor: theme.primary + '20' }]}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <Building2 size={moderateScale(20)} color={theme.primary} />
          )}
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: theme.text }]}>{user.name}</Text>
          <Text style={[styles.status, { color: theme.textSecondary }]}>Online</Text>
        </View>
      </View>

      {/* Chat Messages */}
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: 'factory',
          name: 'Pharma Factory',
        }}
        renderSend={(props) => (
          <View style={styles.sendContainer}>
            <TouchableOpacity
              onPress={() => {
                if (props.text && props.onSend) {
                  props.onSend([{ text: props.text.trim() }], true);
                }
              }}
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
                backgroundColor:
                  props.currentMessage?.user._id === 'factory' ? theme.primary : theme.surface,
                marginRight: props.currentMessage?.user._id === 'factory' ? 0 : moderateScale(40),
                marginLeft: props.currentMessage?.user._id === 'factory' ? moderateScale(40) : 0,
              },
            ]}
          >
            <Text
              style={[
                styles.bubbleText,
                {
                  color: props.currentMessage?.user._id === 'factory' ? '#fff' : theme.text,
                },
              ]}
            >
              {props.currentMessage?.text}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
    gap: moderateScale(12),
  },
  backButton: {
    padding: moderateScale(4),
  },
  avatarContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
  status: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    marginTop: verticalScale(2),
  },
  sendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: moderateScale(8),
  },
  sendButton: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  bubble: {
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(20),
    maxWidth: '75%',
  },
  bubbleText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
});
