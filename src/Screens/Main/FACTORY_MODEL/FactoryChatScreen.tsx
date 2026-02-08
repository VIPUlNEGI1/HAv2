import React, { useState, useCallback, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  TextInput,
} from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { 
  MessageSquare, 
  Search,
  Send,
  Building2,
  ArrowLeft,
} from 'lucide-react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { useNavigation, useRoute } from '@react-navigation/native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface ChatUser {
  id: string;
  name: string;
  type: 'factory' | 'clinic';
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

const FactoryChatScreen = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(route.params?.user || null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock chat users (clinics) - in real app, get from API/store
  const chatUsers: ChatUser[] = [
    {
      id: '1',
      name: 'City Clinic Pharmacy',
      type: 'clinic',
      avatar: undefined,
      lastMessage: 'We need to discuss the bulk order',
      timestamp: '10:30 AM',
      unreadCount: 2,
    },
    {
      id: '2',
      name: 'Health Plus Hospital',
      type: 'clinic',
      avatar: undefined,
      lastMessage: 'Order confirmed, thank you!',
      timestamp: 'Yesterday',
      unreadCount: 0,
    },
    {
      id: '3',
      name: 'MediCare Distributors',
      type: 'clinic',
      avatar: undefined,
      lastMessage: 'When can we expect delivery?',
      timestamp: '2 days ago',
      unreadCount: 1,
    },
  ];

  const filteredUsers = chatUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (selectedUser) {
      // Mock messages - in real app, fetch from API
      setMessages([
        {
          _id: 1,
          text: 'Hello, I have a question about my bulk order.',
          createdAt: new Date(),
          user: {
            _id: selectedUser.id,
            name: selectedUser.name,
          },
        },
        {
          _id: 2,
          text: 'Hello! How can I help you today?',
          createdAt: new Date(),
          user: {
            _id: 'factory',
            name: 'Pharma Factory',
          },
        },
      ]);
    }
  }, [selectedUser]);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
  }, []);

  const renderChatUser = ({ item }: { item: ChatUser }) => (
    <TouchableOpacity
      style={[styles.userCard, { backgroundColor: theme.surface, ...shadows }]}
      onPress={() => setSelectedUser(item)}
      activeOpacity={0.8}
    >
      <View style={[styles.userAvatarContainer, { backgroundColor: theme.primary + '20' }]}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.userAvatar} />
        ) : (
          <Building2 size={moderateScale(24)} color={theme.primary} />
        )}
      </View>
      <View style={styles.userInfo}>
        <View style={styles.userHeader}>
          <Text style={[styles.userName, { color: theme.text }]}>{item.name}</Text>
          <Text style={[styles.timestamp, { color: theme.textSecondary }]}>{item.timestamp}</Text>
        </View>
        <View style={styles.userFooter}>
          <Text style={[styles.lastMessage, { color: theme.textSecondary }]} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={[styles.unreadBadge, { backgroundColor: theme.primary }]}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (selectedUser) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Chat Header */}
        <View style={[styles.chatHeader, { backgroundColor: theme.surface, ...shadows }]}>
          <TouchableOpacity
            onPress={() => setSelectedUser(null)}
            style={styles.backBtn}
          >
            <ArrowLeft size={moderateScale(24)} color={theme.text} />
          </TouchableOpacity>
          <View style={[styles.chatHeaderAvatarContainer, { backgroundColor: theme.primary + '20' }]}>
            {selectedUser.avatar ? (
              <Image source={{ uri: selectedUser.avatar }} style={styles.chatHeaderAvatar} />
            ) : (
              <Building2 size={moderateScale(20)} color={theme.primary} />
            )}
          </View>
          <View style={styles.chatHeaderInfo}>
            <Text style={[styles.chatHeaderName, { color: theme.text }]}>{selectedUser.name}</Text>
            <Text style={[styles.chatHeaderStatus, { color: theme.textSecondary }]}>Online</Text>
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
                  backgroundColor: props.currentMessage?.user._id === 'factory' 
                    ? theme.primary 
                    : theme.surface,
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
  }

  return (
    <ScreenWrapper title="Chat with Clinics" showBack={true} scrollable={false}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.surface, ...shadows }]}>
          <Search size={moderateScale(18)} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search clinics..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Chat Users List */}
      <FlatList
        data={filteredUsers}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInDown.delay(index * 50)}>
            {renderChatUser({ item })}
          </Animated.View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MessageSquare size={moderateScale(48)} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              No clinics found
            </Text>
          </View>
        }
      />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: moderateScale(16),
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(12),
    borderRadius: moderateScale(16),
    gap: moderateScale(12),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(14),
    fontWeight: '500',
  },
  listContent: {
    padding: moderateScale(16),
    paddingTop: 0,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(12),
    gap: moderateScale(12),
  },
  userAvatarContainer: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatar: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
  },
  userInfo: {
    flex: 1,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(4),
  },
  userName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
  timestamp: {
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  userFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: moderateScale(13),
    fontWeight: '500',
    flex: 1,
  },
  unreadBadge: {
    minWidth: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: moderateScale(6),
    marginLeft: moderateScale(8),
  },
  unreadText: {
    color: '#fff',
    fontSize: moderateScale(11),
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(60),
  },
  emptyText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    marginTop: verticalScale(12),
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
    gap: moderateScale(12),
  },
  backBtn: {
    padding: moderateScale(4),
  },
  chatHeaderAvatarContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatHeaderAvatar: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
  },
  chatHeaderInfo: {
    flex: 1,
  },
  chatHeaderName: {
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
  chatHeaderStatus: {
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

export default FactoryChatScreen;
