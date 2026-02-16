import { useState, useCallback, useEffect, useMemo } from 'react';
import { IMessage } from 'react-native-gifted-chat';
import { GiftedChat } from 'react-native-gifted-chat';

export interface DoctorChatUser {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

const MOCK_CHAT_USERS: DoctorChatUser[] = [
  { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=john', lastMessage: 'Thank you doctor!', timestamp: '10:30 AM', unreadCount: 2 },
  { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=jane', lastMessage: 'I will follow the prescription', timestamp: 'Yesterday', unreadCount: 0 },
  { id: '3', name: 'Mike Johnson', avatar: 'https://i.pravatar.cc/150?u=mike', lastMessage: 'When should I take the medicine?', timestamp: '2 days ago', unreadCount: 1 },
];

export const useDoctorChat = (selectedUser: DoctorChatUser | null) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = useMemo(
    () =>
      MOCK_CHAT_USERS.filter((u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  useEffect(() => {
    if (selectedUser) {
      setMessages([
        { _id: 1, text: 'Hello doctor, I have a question about my prescription.', createdAt: new Date(), user: { _id: selectedUser.id, name: selectedUser.name, avatar: selectedUser.avatar } },
        { _id: 2, text: 'Hello! How can I help you today?', createdAt: new Date(), user: { _id: 'doctor', name: 'Dr. Smith' } },
      ]);
    }
  }, [selectedUser]);

  const onSend = useCallback((newMessages: IMessage[] = []) => {
    setMessages((prev) => GiftedChat.append(prev, newMessages));
  }, []);

  return { messages, searchQuery, setSearchQuery, filteredUsers, onSend };
};
