import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Pressable,
  Modal,
  Alert,
  ActivityIndicator,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  CreditCard,
  Camera,
  Image as ImageIcon,
  ChevronRight,
  Edit2,
  Users,
  Upload,
  X,
  Trash2,
} from 'lucide-react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { pickProfileImage } from '@/Helpers/imagePicker';
import { useTheme } from '@/Theme/useTheme';
import { useProfile } from '../ProfileScreen/Hook/useProfile';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import Animated, { FadeIn, FadeInDown, FadeInUp, Layout, SlideInRight } from 'react-native-reanimated';
import { useAuthStore } from '@/hooks/useAuthStore';
import { APICall } from '@/api/client';
import { ApiRoutes } from '@/api/routes';
import { toast } from '@backpackapp-io/react-native-toast';

type TabType = 'profile' | 'documents' | 'payments';

interface UploadedDocument {
  id: string;
  uri: string;
  name: string;
  type: string;
  uploadedAt: string;
}

const TAB_OPTIONS: { key: TabType; label: string; icon: typeof User }[] = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'documents', label: 'Documents', icon: FileText },
  { key: 'payments', label: 'Payments', icon: CreditCard },
];

const PADDING = moderateScale(16);
const CARD_RADIUS = moderateScale(16);
const AVATAR_SIZE = moderateScale(80);
const CAMERA_BADGE_SIZE = moderateScale(30);

function EditField({
  label,
  value,
  onChangeText,
  theme,
  placeholder,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  theme: { text: string; textSecondary: string; border: string };
  placeholder?: string;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
}) {
  return (
    <View style={[styles.editField, { borderBottomColor: theme.border }]}>
      <Text style={[styles.editFieldLabel, { color: theme.textSecondary }]}>{label}</Text>
      <TextInput
        style={[styles.editFieldInput, { color: theme.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary + '99'}
        keyboardType={keyboardType || 'default'}
      />
    </View>
  );
}

const UserInfoScreen = () => {
  const { theme, shadows } = useTheme();
  const {
    user,
    displayName,
    displayEmail,
    displayPhone,
    displayAge,
    displayGender,
    displayLocation,
    avatarUrl,
  } = useProfile();
  const { token, updateUser } = useAuthStore();

  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [localAvatar, setLocalAvatar] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [payments, setPayments] = useState<Array<{ id: string; amount?: number; status?: string; type?: string; created_at?: string }>>([]);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAge, setEditAge] = useState('');
  const [editGender, setEditGender] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const effectiveAvatar = localAvatar || avatarUrl || `https://i.pravatar.cc/150?u=${user?.id || 'user'}`;

  const fetchPayments = useCallback(async () => {
    if (!token) return;
    setLoadingPayments(true);
    const res = await APICall<{ data?: Array<{ _id?: string; amount?: number; status?: string; type?: string; created_at?: string }> }>(
      'get',
      { limit: '20', page: '1', period: 'month' },
      ApiRoutes.payments.list,
      {},
      token
    );
    setLoadingPayments(false);
    if (res.status === 200 && Array.isArray(res.data?.data)) {
      setPayments(
        res.data.data.map((p) => ({
          id: String(p._id ?? ''),
          amount: p.amount,
          status: p.status,
          type: p.type,
          created_at: p.created_at,
        }))
      );
    }
  }, [token]);

  useEffect(() => {
    if (activeTab === 'payments' && token) {
      fetchPayments();
    }
  }, [activeTab, token, fetchPayments]);

  useEffect(() => {
    if (showEditModal) {
      setEditName(displayName || '');
      setEditEmail(displayEmail || '');
      setEditPhone(displayPhone || '');
      setEditAge(displayAge || '');
      setEditGender(displayGender || '');
      setEditLocation(displayLocation || '');
    }
  }, [showEditModal, displayName, displayEmail, displayPhone, displayAge, displayGender, displayLocation]);

  const handleSaveProfile = useCallback(async () => {
    if (!token) return;
    setSavingProfile(true);
    const res = await APICall<{ data?: { name?: string; email?: string; phone_number?: string; age?: number | null; gender?: string | null; location?: unknown } }>(
      'put',
      {
        name: editName.trim() || undefined,
        email: editEmail.trim() ? editEmail.trim().toLowerCase() : undefined,
        phone_number: editPhone.trim() || undefined,
        age: editAge.trim() ? Number(editAge.trim()) : null,
        gender: editGender.trim() || null,
        location: editLocation.trim()
          ? { address: editLocation.trim() }
          : undefined,
      },
      ApiRoutes.auth.profile,
      {},
      token,
    );
    setSavingProfile(false);
    if (res.status === 200 && res.data?.data) {
      const d = res.data.data;
      updateUser({
        name: d.name,
        email: d.email,
        phone_number: d.phone_number,
        age: d.age,
        gender: d.gender,
        location: d.location as any,
      });
      setShowEditModal(false);
    } else {
      const msg = (res.data as { message?: string })?.message || 'Could not update profile.';
      Alert.alert('Error', msg);
    }
  }, [token, editName, editEmail, editPhone, editAge, editGender, editLocation, updateUser]);

  const pickPhoto = useCallback(
    (source: 'camera' | 'gallery') => {
      pickProfileImage(source, (uri, error) => {
        setShowPhotoModal(false);
        if (error) {
          toast.error(error);
          return;
        }
        if (!uri) return;
        setLocalAvatar(uri);
        setUploadingAvatar(true);
        APICall<{ data?: { avatar_url?: string } }>(
          'post',
          { image_url: uri },
          ApiRoutes.profile.uploadImage,
          {},
          token,
        )
          .then((r) => {
            if (r.status === 200 && r.data?.data?.avatar_url) {
              const url = r.data.data.avatar_url;
              setLocalAvatar(url);
              updateUser({ avatar_url: url });
            }
          })
          .catch(() => {})
          .finally(() => setUploadingAvatar(false));
      });
    },
    [token, updateUser],
  );

  const pickDocument = useCallback((source: 'camera' | 'gallery') => {
    pickProfileImage(source, (uri) => {
      setShowDocModal(false);
      if (!uri) return;
      const name = uri.split('/').pop() || 'Document';
      setDocuments((prev) => [
        ...prev,
        { id: Date.now().toString(), uri, name, type: 'image', uploadedAt: new Date().toISOString().split('T')[0] },
      ]);
    });
  }, []);

  const removeDocument = useCallback((id: string) => {
    Alert.alert('Remove document', 'Delete this document?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setDocuments((p) => p.filter((d) => d.id !== id)) },
    ]);
  }, []);

  const formatDocDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const InfoRow = ({
    icon: Icon,
    label,
    value,
    onEdit,
    isLast,
  }: {
    icon: typeof User;
    label: string;
    value: string;
    onEdit?: () => void;
    isLast?: boolean;
  }) => (
    <View
      style={[
        styles.infoRow,
        { borderBottomColor: isLast ? 'transparent' : theme.border },
      ]}
    >
      <View style={[styles.infoIconWrap, { backgroundColor: theme.primary + '14' }]}>
        <Icon size={moderateScale(18)} color={theme.primary} strokeWidth={2} />
      </View>
      <View style={styles.infoContent}>
        <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: theme.text }]} numberOfLines={1}>
          {value || '—'}
        </Text>
      </View>
      {onEdit && (
        <Pressable
          onPress={onEdit}
          style={({ pressed }) => [
            styles.editBtn,
            { backgroundColor: theme.primary + '18', opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Edit2 size={moderateScale(14)} color={theme.primary} strokeWidth={2} />
        </Pressable>
      )}
    </View>
  );

  return (
    <ScreenWrapper title="Account" showBack={true} scrollable={false}>
      {/* Profile hero card */}
      <Animated.View entering={FadeIn.duration(400)} style={[styles.profileCard, styles.profileHero, { backgroundColor: theme.surface, borderColor: theme.border, ...shadows, borderRadius: CARD_RADIUS }]}>
        <View style={styles.profileRow}>
          <Pressable
            onPress={() => setShowPhotoModal(true)}
            style={({ pressed }) => [styles.avatarWrap, { borderColor: theme.border }, pressed && { opacity: 0.9 }]}
          >
            {uploadingAvatar ? (
              <View style={[styles.avatarPlaceholder, { backgroundColor: theme.primary + '18' }]}>
                <ActivityIndicator color={theme.primary} size="small" />
              </View>
            ) : (
              <Image source={{ uri: effectiveAvatar }} style={styles.avatar} />
            )}
            <View style={[styles.cameraBadge, { backgroundColor: theme.primary }]}>
              <Camera size={moderateScale(18)} color="#fff" strokeWidth={2.5} />
            </View>
          </Pressable>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.text }]} numberOfLines={1}>
              {displayName || 'Add your name'}
            </Text>
            <Text style={[styles.profileEmail, { color: theme.textSecondary }]} numberOfLines={1}>
              {displayEmail || 'Add your email'}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Edit profile modal */}
      <Modal visible={showEditModal} transparent animationType="slide">
        <Pressable style={styles.modalBackdrop} onPress={() => !savingProfile && setShowEditModal(false)}>
          <Pressable style={[styles.editModalContent, { backgroundColor: theme.surface }]} onPress={(e) => e.stopPropagation()}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Edit profile</Text>
              <TouchableOpacity onPress={() => !savingProfile && setShowEditModal(false)}>
                <X size={moderateScale(22)} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <ScrollView style={styles.editForm} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                <EditField label="Name" value={editName} onChangeText={setEditName} theme={theme} placeholder="Your name" />
                <EditField label="Email" value={editEmail} onChangeText={setEditEmail} theme={theme} placeholder="email@example.com" keyboardType="email-address" />
                <EditField label="Mobile" value={editPhone} onChangeText={setEditPhone} theme={theme} placeholder="10-digit mobile" keyboardType="phone-pad" />
                <EditField label="Age" value={editAge} onChangeText={setEditAge} theme={theme} placeholder="Age" keyboardType="numeric" />
                <EditField label="Gender" value={editGender} onChangeText={setEditGender} theme={theme} placeholder="e.g. Male, Female" />
                <EditField label="Location" value={editLocation} onChangeText={setEditLocation} theme={theme} placeholder="Your address" />
              </ScrollView>
              <TouchableOpacity
                style={[styles.saveProfileBtn, { backgroundColor: theme.primary }]}
                onPress={handleSaveProfile}
                disabled={savingProfile}
                activeOpacity={0.9}
              >
                {savingProfile ? <ActivityIndicator color="#fff" size="small" /> : <Text style={styles.saveProfileBtnText}>Save</Text>}
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Photo upload modal */}
      <Modal visible={showPhotoModal} transparent animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={() => setShowPhotoModal(false)}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface, ...shadows }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Change photo</Text>
              <TouchableOpacity onPress={() => setShowPhotoModal(false)}>
                <X size={moderateScale(22)} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.modalOption, { borderBottomColor: theme.border }]}
              onPress={() => pickPhoto('camera')}
              activeOpacity={0.7}
            >
              <Camera size={moderateScale(22)} color={theme.primary} strokeWidth={2} />
              <Text style={[styles.modalOptionText, { color: theme.text }]}>Take photo</Text>
              <ChevronRight size={moderateScale(20)} color={theme.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalOption, { borderBottomColor: theme.border, borderBottomWidth: 0 }]}
              onPress={() => pickPhoto('gallery')}
              activeOpacity={0.7}
            >
              <ImageIcon size={moderateScale(22)} color={theme.primary} strokeWidth={2} />
              <Text style={[styles.modalOptionText, { color: theme.text }]}>Choose from gallery</Text>
              <ChevronRight size={moderateScale(20)} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Document upload modal */}
      <Modal visible={showDocModal} transparent animationType="fade">
        <Pressable style={styles.modalBackdrop} onPress={() => setShowDocModal(false)}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface, ...shadows }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>Upload document</Text>
              <TouchableOpacity onPress={() => setShowDocModal(false)}>
                <X size={moderateScale(22)} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[styles.modalOption, { borderBottomColor: theme.border }]}
              onPress={() => pickDocument('camera')}
              activeOpacity={0.7}
            >
              <Camera size={moderateScale(22)} color={theme.primary} strokeWidth={2} />
              <Text style={[styles.modalOptionText, { color: theme.text }]}>Scan / take photo</Text>
              <ChevronRight size={moderateScale(20)} color={theme.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalOption, { borderBottomColor: theme.border, borderBottomWidth: 0 }]}
              onPress={() => pickDocument('gallery')}
              activeOpacity={0.7}
            >
              <ImageIcon size={moderateScale(22)} color={theme.primary} strokeWidth={2} />
              <Text style={[styles.modalOptionText, { color: theme.text }]}>Choose from gallery</Text>
              <ChevronRight size={moderateScale(20)} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Tab bar */}
      <Animated.View
        entering={FadeInDown.delay(80).duration(350)}
        style={[styles.tabBar, { backgroundColor: theme.surface, borderColor: theme.border, ...shadows, borderRadius: CARD_RADIUS }]}
      >
        {TAB_OPTIONS.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[
                styles.tab,
                isActive && { backgroundColor: theme.primary + '12', borderColor: theme.primary + '30', borderWidth: 1 },
              ]}
              activeOpacity={0.85}
            >
              <Icon
                size={moderateScale(20)}
                color={isActive ? theme.primary : theme.textSecondary}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <Text
                style={[styles.tabLabel, { color: isActive ? theme.primary : theme.textSecondary, fontWeight: isActive ? '600' : '500' }]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === 'profile' && (
          <Animated.View entering={FadeInUp.duration(350)} layout={Layout} style={styles.tabContent}>
            <View
              style={[
                styles.detailsCard,
                { backgroundColor: theme.surface, borderColor: theme.border, ...shadows, borderRadius: CARD_RADIUS },
              ]}
            >
              <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>Personal details</Text>
              <InfoRow icon={User} label="Name" value={displayName || user?.name || ''} onEdit={() => setShowEditModal(true)} />
              <InfoRow icon={Mail} label="Email" value={displayEmail || ''} onEdit={() => setShowEditModal(true)} />
              <InfoRow icon={Phone} label="Mobile" value={displayPhone || ''} onEdit={() => setShowEditModal(true)} />
              <InfoRow icon={Calendar} label="Age" value={displayAge || ''} onEdit={() => setShowEditModal(true)} />
              <InfoRow icon={Users} label="Gender" value={displayGender || ''} onEdit={() => setShowEditModal(true)} />
              <InfoRow icon={MapPin} label="Location" value={displayLocation || ''} onEdit={() => setShowEditModal(true)} isLast />
            </View>
          </Animated.View>
        )}

        {activeTab === 'documents' && (
          <Animated.View entering={FadeInUp.duration(350)} layout={Layout} style={styles.tabContent}>
            {documents.length > 0 ? (
              <>
                <View style={styles.docHeader}>
                  <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>Your documents</Text>
                  <TouchableOpacity
                    style={[styles.addDocBtn, { backgroundColor: theme.primary }]}
                    onPress={() => setShowDocModal(true)}
                    activeOpacity={0.9}
                  >
                    <Upload size={moderateScale(18)} color="#fff" strokeWidth={2} />
                    <Text style={styles.addDocBtnText}>Add</Text>
                  </TouchableOpacity>
                </View>
                {documents.map((doc, index) => (
                  <Animated.View
                    key={doc.id}
                    entering={SlideInRight.delay(index * 50).duration(300)}
                    layout={Layout}
                    style={[
                      styles.docCard,
                      { backgroundColor: theme.surface, ...shadows, borderColor: theme.border },
                    ]}
                  >
                    <Image source={{ uri: doc.uri }} style={styles.docThumb} />
                    <View style={styles.docInfo}>
                      <Text style={[styles.docName, { color: theme.text }]} numberOfLines={1}>
                        {doc.name}
                      </Text>
                      <Text style={[styles.docDate, { color: theme.textSecondary }]}>
                        {formatDocDate(doc.uploadedAt)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => removeDocument(doc.id)}
                      style={[styles.docDelete, { backgroundColor: theme.error + '20' }]}
                    >
                      <Trash2 size={moderateScale(18)} color={theme.error} strokeWidth={2} />
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </>
            ) : (
              <View
                style={[
                  styles.emptyCard,
                  { backgroundColor: theme.surface, borderColor: theme.border, ...shadows, borderRadius: CARD_RADIUS },
                ]}
              >
                <View style={[styles.emptyIconWrap, { backgroundColor: theme.primary + '14' }]}>
                  <FileText size={moderateScale(56)} color={theme.primary} strokeWidth={1.5} />
                </View>
                <Text style={[styles.emptyTitle, { color: theme.text }]}>No documents yet</Text>
                <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                  Upload IDs, prescriptions, or medical records{'\n'}to keep them in one place
                </Text>
                <TouchableOpacity
                  style={[styles.uploadBtn, { backgroundColor: theme.primary }]}
                  onPress={() => setShowDocModal(true)}
                  activeOpacity={0.9}
                >
                  <Upload size={moderateScale(20)} color="#fff" strokeWidth={2} />
                  <Text style={styles.uploadBtnText}>Upload document</Text>
                  <ChevronRight size={moderateScale(20)} color="#fff" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        )}

        {activeTab === 'payments' && (
          <Animated.View entering={FadeInUp.duration(350)} style={styles.tabContent}>
            {loadingPayments ? (
              <View style={[styles.emptyCard, { backgroundColor: theme.surface, ...shadows }]}>
                <ActivityIndicator size="small" color={theme.primary} />
              </View>
            ) : payments.length > 0 ? (
              <>
                <Text style={[styles.cardTitle, { color: theme.textSecondary }]}>Payment history</Text>
                {payments.map((p) => (
                  <View
                    key={p.id}
                    style={[
                      styles.docCard,
                      { backgroundColor: theme.surface, borderColor: theme.border, ...shadows },
                    ]}
                  >
                    <View style={[styles.docInfo, { flex: 1 }]}>
                      <Text style={[styles.docName, { color: theme.text }]}>₹{p.amount ?? 0}</Text>
                      <Text style={[styles.docDate, { color: theme.textSecondary }]}>
                        {p.status ?? 'pending'} · {p.created_at ? formatDocDate(p.created_at) : ''}
                      </Text>
                    </View>
                    <CreditCard size={moderateScale(20)} color={theme.primary} strokeWidth={2} />
                  </View>
                ))}
              </>
            ) : (
              <View
                style={[
                  styles.emptyCard,
                  { backgroundColor: theme.surface, borderColor: theme.border, ...shadows, borderRadius: CARD_RADIUS },
                ]}
              >
                <View style={[styles.emptyIconWrap, { backgroundColor: theme.primary + '14' }]}>
                  <CreditCard size={moderateScale(56)} color={theme.primary} strokeWidth={1.5} />
                </View>
                <Text style={[styles.emptyTitle, { color: theme.text }]}>No payment history</Text>
                <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
                  Your transactions and payment history{'\n'}will appear here
                </Text>
              </View>
            )}
          </Animated.View>
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  profileCard: {
    marginHorizontal: PADDING,
    marginTop: verticalScale(12),
    padding: PADDING,
    overflow: 'hidden',
  },
  profileHero: {
    padding: moderateScale(20),
    borderWidth: StyleSheet.hairlineWidth,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(20),
  },
  avatarWrap: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: CAMERA_BADGE_SIZE,
    height: CAMERA_BADGE_SIZE,
    borderRadius: CAMERA_BADGE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    flex: 1,
    minWidth: 0,
    paddingVertical: verticalScale(2),
  },
  profileName: {
    fontSize: moderateScale(20),
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  profileEmail: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    opacity: 0.9,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: moderateScale(16),
    borderTopRightRadius: moderateScale(16),
    paddingBottom: verticalScale(32),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(16),
    paddingHorizontal: PADDING,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalTitle: {
    fontSize: moderateScale(18),
    fontWeight: '700',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(16),
    paddingHorizontal: PADDING,
    gap: moderateScale(14),
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  modalOptionText: {
    flex: 1,
    fontSize: moderateScale(16),
    fontWeight: '600',
  },
  editModalContent: {
    marginHorizontal: PADDING,
    marginTop: verticalScale(80),
    borderTopLeftRadius: moderateScale(16),
    borderTopRightRadius: moderateScale(16),
    paddingBottom: verticalScale(40),
    maxHeight: '85%',
  },
  editForm: {
    maxHeight: verticalScale(360),
  },
  editField: {
    paddingHorizontal: PADDING,
    paddingVertical: verticalScale(12),
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  editFieldLabel: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    marginBottom: 4,
  },
  editFieldInput: {
    fontSize: moderateScale(16),
    paddingVertical: 4,
  },
  saveProfileBtn: {
    marginHorizontal: PADDING,
    marginTop: verticalScale(20),
    paddingVertical: verticalScale(14),
    borderRadius: moderateScale(12),
    alignItems: 'center',
  },
  saveProfileBtnText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: PADDING,
    marginTop: verticalScale(16),
    marginBottom: verticalScale(12),
    padding: moderateScale(4),
    borderWidth: 1,
    gap: moderateScale(4),
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(14),
    paddingHorizontal: moderateScale(8),
    borderRadius: moderateScale(12),
    gap: moderateScale(6),
  },
  tabLabel: {
    fontSize: moderateScale(13),
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: PADDING,
    paddingBottom: verticalScale(48),
  },
  tabContent: { marginTop: verticalScale(4) },
  detailsCard: {
    padding: 0,
    overflow: 'hidden',
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    paddingHorizontal: PADDING,
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(12),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PADDING,
    paddingVertical: verticalScale(14),
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: moderateScale(12),
  },
  infoIconWrap: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: { flex: 1, minWidth: 0 },
  infoLabel: {
    fontSize: moderateScale(12),
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: moderateScale(15),
    fontWeight: '600',
  },
  editBtn: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCard: {
    padding: PADDING * 2,
    alignItems: 'center',
    minHeight: verticalScale(300),
    justifyContent: 'center',
  },
  emptyIconWrap: {
    width: moderateScale(88),
    height: moderateScale(88),
    borderRadius: moderateScale(44),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(24),
  },
  emptyTitle: {
    fontSize: moderateScale(20),
    fontWeight: '800',
    marginBottom: verticalScale(10),
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: moderateScale(14),
    lineHeight: 22,
    textAlign: 'center',
  },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(28),
    paddingHorizontal: moderateScale(28),
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(14),
    gap: moderateScale(12),
  },
  uploadBtnText: {
    color: '#fff',
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
    paddingRight: moderateScale(4),
  },
  addDocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(12),
    gap: moderateScale(6),
  },
  addDocBtnText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: PADDING,
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(12),
    borderWidth: 1,
    gap: moderateScale(14),
  },
  docThumb: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: moderateScale(10),
    backgroundColor: '#f0f0f0',
  },
  docInfo: { flex: 1, minWidth: 0 },
  docName: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    marginBottom: 2,
  },
  docDate: {
    fontSize: moderateScale(12),
  },
  docDelete: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default UserInfoScreen;
