import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Search } from 'lucide-react-native';
import { supabase } from '@/hooks/superbase';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useTheme } from '@/Theme/useTheme';
import { CustomRefresh } from '@/Components/CustomRefresh';

const UserListScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const currentUser = useAuthStore(state => state.user);

  const fetchUsers = useCallback(async () => {
    if (!currentUser) return;
    try {
      const { data, error } = await supabase
        .from('login')
        .select('*')
        .neq('id', currentUser.id);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const onSelectUser = (user: any) => {
    navigation.navigate('ChatScreen', { receiver: user });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers();
  };

  const filteredUsers = users.filter(
    u =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone_number?.includes(search),
  );

  const renderUserItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.userItem, { borderBottomColor: theme.border }]}
      onPress={() => onSelectUser(item)}
    >
      <View style={styles.avatarContainer}>
        {item.avatar_url ? (
          <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.placeholderAvatar, { backgroundColor: theme.border }]}>
            <Text style={[styles.avatarText, { color: theme.textSecondary }]}>
              {item.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.userInfo}>
        <Text style={[styles.userName, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.userPhone, { color: theme.textSecondary }]}>{item.phone_number}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Messages</Text>
      </View>
      <View style={[styles.searchContainer, { backgroundColor: theme.surface }]}>
        <View style={[styles.searchBar, { backgroundColor: theme.background, borderColor: theme.border }]}>
          <Search size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Search by name or phone..."
            placeholderTextColor={theme.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>
      {loading && !refreshing ? (
        <ActivityIndicator style={styles.loader} color={theme.primary} />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={item => item.id}
          renderItem={renderUserItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No users found</Text>
          }
          refreshControl={
            <CustomRefresh
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
          ListFooterComponent={<View style={styles.footerSpacer} />}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 20, paddingTop: 60 },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  searchContainer: { paddingHorizontal: 15, paddingBottom: 15 },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderRadius: 10, paddingHorizontal: 12, height: 45, borderWidth: 1 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  listContent: { paddingHorizontal: 15 },
  userItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  avatarContainer: { marginRight: 15 },
  avatar: { width: 55, height: 55, borderRadius: 27.5 },
  placeholderAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: 'bold' },
  userInfo: { flex: 1 },
  userName: { fontSize: 18, fontWeight: '600' },
  userPhone: { fontSize: 14, marginTop: 2 },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  loader: { marginTop: 20 },
  footerSpacer: { height: 40 },
});

export default UserListScreen;
