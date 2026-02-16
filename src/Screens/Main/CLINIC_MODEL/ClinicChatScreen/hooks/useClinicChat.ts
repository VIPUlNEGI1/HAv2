import { useState, useCallback, useEffect, useMemo } from 'react';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';

export interface ChatUser {
  id: string;
  name: string;
  type: 'factory' | 'clinic';
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

const MOCK_CHAT_USERS: ChatUser[] = [
  {
    id: '1',
    name: 'Pharma Factory Ltd.',
    type: 'factory',
    avatar: undefined,
    lastMessage: 'Your order is ready for shipping',
    timestamp: '10:30 AM',
    unreadCount: 2,
  },
  {
    id: '2',
    name: 'MediCare Distributors',
    type: 'factory',
    avatar: undefined,
    lastMessage: 'Bulk order confirmed',
    timestamp: 'Yesterday',
    unreadCount: 0,
  },
  {
    id: '3',
    name: 'Health Supplies Factory',
    type: 'factory',
    avatar: undefined,
    lastMessage: 'When can we expect delivery?',
    timestamp: '2 days ago',
    unreadCount: 1,
  },
];

export const useClinicChat = (selectedUser: ChatUser | null) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const chatUsers = MOCK_CHAT_USERS;

  const filteredUsers = useMemo(
    () =>
      chatUsers.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  useEffect(() => {
    if (selectedUser) {
      setMessages([
        {
          _id: 1,
          text: 'Hello, I have a question about my bulk order.',
          createdAt: new Date(),
          user: {
            _id: 'clinic',
            name: 'City Clinic',
          },
        },
        {
          _id: 2,
          text: 'Hello! How can I help you today?',
          createdAt: new Date(),
          user: {
            _id: selectedUser.id,
            name: selectedUser.name,
          },
        },
      ]);
    }
  }, [selectedUser]);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, newMessages)
    );
  }, []);

  return {
    messages,
    setMessages,
    searchQuery,
    setSearchQuery,
    filteredUsers,
    onSend,
  };
};
