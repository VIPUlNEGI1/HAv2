import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { SearchBar, EmptyState } from '@/Components/common';
import { useFactoryChat } from './hooks/useFactoryChat';
import { ChatUserCard } from './components/ChatUserCard';
import { ChatView } from './components/ChatView';
import { useRoute } from '@react-navigation/native';
import { MessageSquare } from 'lucide-react-native';

const FactoryChatScreen = () => {
  const { theme } = useTheme();
  const route = useRoute<any>();
  const { chatUsers, messages, selectedUser, searchQuery, setSearchQuery, setSelectedUser, onSend } =
    useFactoryChat(route.params?.user || null);

  if (selectedUser) {
    return (
      <ChatView user={selectedUser} messages={messages} onBack={() => setSelectedUser(null)} onSend={onSend} />
    );
  }

  return (
    <ScreenWrapper title="Chat with Clinics" showBack={true} scrollable={false}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search clinics..."
            style={styles.searchBar}
          />
        </View>

        {/* Chat Users List */}
        <FlatList
          data={chatUsers}
          renderItem={({ item, index }) => (
            <ChatUserCard key={item.id} user={item} onPress={() => setSelectedUser(item)} index={index} />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <EmptyState icon={MessageSquare} title="No Clinics Found" message="No clinics available to chat." />
          }
        />
      </View>
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
    marginHorizontal: 0,
  },
  listContent: {
    padding: moderateScale(16),
    paddingTop: 0,
  },
});

export default FactoryChatScreen;
