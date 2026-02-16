import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  Platform,
} from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import {
  FileText,
  Download,
  Eye,
  User,
  Filter,
  Image as ImageIcon,
  File,
  X,
  ChevronDown,
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Toasts, toast } from '@backpackapp-io/react-native-toast';
import { useDoctorDocuments, type Document } from './hooks/useDoctorDocuments';

const DoctorDocumentsScreen = () => {
  const { theme, shadows } = useTheme();
  const {
    selectedPatient,
    setSelectedPatient,
    showFilter,
    setShowFilter,
    documents: filteredDocuments,
    allDocuments,
    patientFilters,
  } = useDoctorDocuments();

  const patients = patientFilters.map((p) => {
    const doc = allDocuments.find((d) => d.patient === p.value);
    return {
      name: p.value,
      image: doc?.patientImage || '',
      count: allDocuments.filter((d) => d.patient === p.value).length,
    };
  });

  const handleDownload = async (document: Document) => {
    try {
      // In real app, download from server using react-native-fs or similar
      // For now, just show success message
      toast.success(`Downloading ${document.name}...`);
      
      // Simulate download
      setTimeout(() => {
        toast.success(`${document.name} downloaded successfully!`);
      }, 2000);
    } catch (error) {
      toast.error('Failed to download document');
    }
  };

  const handleView = (document: Document) => {
    // In real app, open document viewer
    Alert.alert('View Document', `Opening ${document.name}...`);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return FileText;
      case 'image':
        return ImageIcon;
      default:
        return File;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const renderPatientFilter = () => (
    <View style={styles.filterContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScrollContent}
      >
        <TouchableOpacity
          style={[
            styles.filterChip,
            { 
              backgroundColor: selectedPatient === null ? theme.primary : theme.surface,
              borderColor: selectedPatient === null ? theme.primary : theme.border,
            },
            shadows,
          ]}
          onPress={() => setSelectedPatient(null)}
        >
          <Text style={[
            styles.filterChipText,
            { color: selectedPatient === null ? '#fff' : theme.text }
          ]}>
            All Patients ({allDocuments.length})
          </Text>
        </TouchableOpacity>
        {patients.map((patient) => (
          <TouchableOpacity
            key={patient.name}
            style={[
              styles.filterChip,
              { 
                backgroundColor: selectedPatient === patient.name ? theme.primary : theme.surface,
                borderColor: selectedPatient === patient.name ? theme.primary : theme.border,
              },
              shadows,
            ]}
            onPress={() => setSelectedPatient(patient.name)}
          >
            <Image source={{ uri: patient.image }} style={styles.filterAvatar} />
            <Text style={[
              styles.filterChipText,
              { color: selectedPatient === patient.name ? '#fff' : theme.text }
            ]}>
              {patient.name} ({patient.count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderDocument = ({ item, index }: { item: Document; index: number }) => {
    const FileIcon = getFileIcon(item.type);
    const isImage = item.type === 'image';

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 50)}
      >
        <View style={[styles.docCard, { backgroundColor: theme.surface, ...shadows }]}>
          <View style={styles.docHeader}>
            <View style={[styles.docIconBg, { backgroundColor: theme.primary + '10' }]}>
              <FileIcon size={moderateScale(24)} color={theme.primary} />
            </View>
            {isImage && (
              <Image source={{ uri: item.uri }} style={styles.docThumbnail} />
            )}
            <View style={styles.docInfo}>
              <Text style={[styles.docName, { color: theme.text }]} numberOfLines={2}>
                {item.name}
              </Text>
              <View style={styles.patientRow}>
                <Image source={{ uri: item.patientImage }} style={styles.patientAvatar} />
                <Text style={[styles.patientName, { color: theme.textSecondary }]}>
                  {item.patient}
                </Text>
              </View>
              <View style={styles.docMeta}>
                <Text style={[styles.docMetaText, { color: theme.textSecondary }]}>
                  {item.date} • {formatFileSize(item.size)}
                </Text>
              </View>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.docFooter}>
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: theme.primary + '15' }]}
              onPress={() => handleView(item)}
            >
              <Eye size={moderateScale(20)} color={theme.primary} />
              <Text style={[styles.actionText, { color: theme.primary }]}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionBtn, { backgroundColor: theme.primary + '15' }]}
              onPress={() => handleDownload(item)}
            >
              <Download size={moderateScale(20)} color={theme.primary} />
              <Text style={[styles.actionText, { color: theme.primary }]}>Download</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <ScreenWrapper title="Patient Documents" showBack={true} scrollable={false}>
      {/* Patient Filter */}
      {renderPatientFilter()}

      {/* Documents List */}
      <FlatList
        data={filteredDocuments}
        renderItem={renderDocument}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FileText size={moderateScale(64)} color={theme.textSecondary} />
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
              {selectedPatient 
                ? `No documents for ${selectedPatient}`
                : 'No documents found'}
            </Text>
          </View>
        }
      />
      <Toasts />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  filterContainer: {
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  filterScrollContent: {
    paddingHorizontal: moderateScale(16),
    gap: moderateScale(12),
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    gap: moderateScale(8),
  },
  filterAvatar: {
    width: moderateScale(20),
    height: moderateScale(20),
    borderRadius: moderateScale(10),
  },
  filterChipText: {
    fontSize: moderateScale(13),
    fontWeight: '700',
  },
  listContent: {
    padding: moderateScale(16),
  },
  docCard: {
    borderRadius: moderateScale(20),
    padding: moderateScale(16),
    marginBottom: verticalScale(16),
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: moderateScale(12),
  },
  docIconBg: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  docThumbnail: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(8),
  },
  docInfo: {
    flex: 1,
  },
  docName: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    marginBottom: verticalScale(6),
  },
  patientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6),
    marginBottom: verticalScale(4),
  },
  patientAvatar: {
    width: moderateScale(18),
    height: moderateScale(18),
    borderRadius: moderateScale(9),
  },
  patientName: {
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  docMeta: {
    marginTop: verticalScale(2),
  },
  docMetaText: {
    fontSize: moderateScale(11),
    fontWeight: '500',
  },
  divider: {
    height: 1,
    width: '100%',
    marginVertical: verticalScale(12),
  },
  docFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: moderateScale(12),
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(12),
    gap: moderateScale(6),
  },
  actionText: {
    fontSize: moderateScale(13),
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
    textAlign: 'center',
  },
});

export default DoctorDocumentsScreen;
