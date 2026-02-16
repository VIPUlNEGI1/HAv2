import { useState, useMemo, useCallback, useEffect } from 'react';
import { IMessage } from 'react-native-gifted-chat';

export interface ChatUser {
  id: string;
  name: string;
  type: 'factory' | 'clinic';
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

// Dummy data
const DUMMY_CHAT_USERS: ChatUser[] = [
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

const DUMMY_MESSAGES: IMessage[] = [
  {
    _id: 1,
    text: 'Hello, I have a question about my bulk order.',
    createdAt: new Date(),
    user: {
      _id: '1',
      name: 'City Clinic Pharmacy',
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
];

export const useFactoryChat = (initialUser?: ChatUser | null) => {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(initialUser || null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Filter users
  const filteredUsers = useMemo(() => {
    return DUMMY_CHAT_USERS.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Load messages when user is selected
  useEffect(() => {
    if (selectedUser) {
      setMessages(DUMMY_MESSAGES);
    } else {
      setMessages([]);
    }
  }, [selectedUser]);

  // Send message
  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((previousMessages) => {
      return [...newMessages, ...previousMessages];
    });
  }, []);

  // Get user by ID
  const getUserById = (id: string) => {
    return DUMMY_CHAT_USERS.find((user) => user.id === id);
  };

  return {
    // Data
    chatUsers: filteredUsers,
    allUsers: DUMMY_CHAT_USERS,
    messages,
    selectedUser,

    // Search
    searchQuery,
    setSearchQuery,

    // Actions
    setSelectedUser,
    onSend,

    // Loading
    loading,

    // Helpers
    getUserById,
  };
};
