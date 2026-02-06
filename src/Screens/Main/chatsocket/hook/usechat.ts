import { useEffect, useState, useCallback } from 'react';
import { IMessage } from 'react-native-gifted-chat';
import * as ImagePicker from 'react-native-image-picker';
import { supabase } from '@/hooks/superbase';
import { User } from '@/types';

export const useChat = (currentUser: User | null, receiver: User | null) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = useCallback(async () => {
    if (!currentUser || !receiver) return;

    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(
        `and(sender_id.eq.${currentUser.id},receiver_id.eq.${receiver.id}),and(sender_id.eq.${receiver.id},receiver_id.eq.${currentUser.id})`,
      )
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading messages:', error);
      return;
    }

    const formatted: IMessage[] = (data || []).map(msg => ({
      _id: msg.id,
      text: msg.type === 'text' ? msg.content : '',
      createdAt: new Date(msg.created_at),
      user: {
        _id: msg.sender_id,
        name:
          msg.sender_id === currentUser.id ? currentUser.name : receiver.name,
        avatar:
          msg.sender_id === currentUser.id
            ? currentUser.avatar_url
            : receiver.avatar_url,
      },
      image: msg.type === 'image' ? msg.content : undefined,
    }));

    setMessages(formatted);
    setLoading(false);
  }, [currentUser, receiver]);

  useEffect(() => {
    if (!currentUser || !receiver) return;

    loadMessages();

    const channel = supabase
      .channel(`chat-${currentUser.id}-${receiver.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${currentUser.id}`,
        },
        payload => {
          const msg = payload.new;
          if (msg.sender_id === receiver.id) {
            setMessages(prev => [
              {
                _id: msg.id,
                text: msg.type === 'text' ? msg.content : '',
                createdAt: new Date(msg.created_at),
                user: {
                  _id: msg.sender_id,
                  name: receiver.name,
                  avatar: receiver.avatar_url,
                },
                image: msg.type === 'image' ? msg.content : undefined,
              },
              ...prev,
            ]);
          }
        },
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [currentUser, receiver, loadMessages]);

  const uploadFile = async (uri: string, name: string, type: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const filePath = `chat/${Date.now()}-${name}`;
    const { error } = await supabase.storage
      .from('chat-files')
      .upload(filePath, blob, { contentType: type });

    if (error) throw error;

    const { data } = supabase.storage.from('chat-files').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const sendMessage = useCallback(
    async (msgs: IMessage[] = []) => {
      if (!currentUser || !receiver) return;
      const msg = msgs[0];

      const { error } = await supabase.from('messages').insert({
        sender_id: currentUser.id,
        receiver_id: receiver.id,
        content: msg.image || msg.text || '',
        type: msg.image ? 'image' : 'text',
      });

      if (error) {
        console.error('Error sending message:', error);
      } else {
        setMessages(prev => [msg, ...prev]);
      }
    },
    [currentUser, receiver],
  );

  const pickImage = async () => {
    if (!currentUser) return;
    ImagePicker.launchImageLibrary({ mediaType: 'photo' }, async response => {
      if (response.didCancel || response.errorCode) return;
      const asset = response.assets?.[0];
      if (!asset) return;

      try {
        const url = await uploadFile(
          asset.uri || '',
          asset.fileName || 'file.jpg',
          asset.type || 'image/jpeg',
        );
        sendMessage([
          {
            _id: Date.now().toString(),
            text: '',
            createdAt: new Date(),
            user: { _id: currentUser.id, name: currentUser.name },
            image: url,
          },
        ]);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    });
  };

  return { messages, loading, sendMessage, pickImage };
};
