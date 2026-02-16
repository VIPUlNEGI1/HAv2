import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import {
  User,
  Mail,
  Phone,
  Award,
  Edit2,
  Save,
  Camera,
  FileText,
  Upload,
  Plus,
  Trash2,
  X,
  GraduationCap,
  Building2,
  Activity,
  Tag,
  Settings,
} from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Toasts } from '@backpackapp-io/react-native-toast';
import { useNavigation } from '@react-navigation/native';
import { useDoctorProfile } from './hooks/useDoctorProfile';

const DoctorProfileScreen = () => {
  const { theme, shadows } = useTheme();
  const navigation = useNavigation<any>();
  const {
    profile,
    setProfile,
    educations,
    setEducations,
    hospitalExperiences,
    setHospitalExperiences,
    specializations,
    setSpecializations,
    documents,
    setDocuments,
    isEditing,
    setIsEditing,
    uploading,
    handleImagePicker,
    handleUploadDocument,
    handleDeleteDocument,
    handleAddEducation,
    handleAddHospitalExperience,
    handleAddSpecialization,
    handleSave,
  } = useDoctorProfile();

  return (
    <ScreenWrapper 
      title="Doctor Profile" 
      showBack={true} 
      scrollable={true}
      headerRight={
        <TouchableOpacity
                onPress={() => navigation.navigate('SettingsScreen')}
          style={styles.settingsBtn}
        >
          <Settings size={moderateScale(22)} color={theme.text} />
        </TouchableOpacity>
      }
    >
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <Animated.View 
          entering={FadeInUp}
          style={[styles.profileHeader, { backgroundColor: theme.surface, ...shadows }]}
        >
          <View style={styles.avatarContainer}>
            {profile.image ? (
              <Image source={{ uri: profile.image }} style={styles.avatarImage} />
            ) : (
              <View style={[styles.avatar, { backgroundColor: theme.primary + '20' }]}>
                <User size={moderateScale(50)} color={theme.primary} />
              </View>
            )}
            {isEditing && (
              <TouchableOpacity 
                style={[styles.cameraBtn, { backgroundColor: theme.primary }]}
                onPress={handleImagePicker}
              >
                <Camera size={moderateScale(14)} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          
          <Text style={[styles.name, { color: theme.text }]}>{profile.name}</Text>
          <Text style={[styles.specialization, { color: theme.primary }]}>{profile.specialization}</Text>
          
          <TouchableOpacity 
            style={[styles.editBtn, { backgroundColor: theme.primary }]}
            onPress={() => isEditing ? handleSave() : setIsEditing(true)}
          >
            {isEditing ? (
              <Save size={moderateScale(16)} color="#fff" />
            ) : (
              <Edit2 size={moderateScale(16)} color="#fff" />
            )}
            <Text style={styles.editBtnText}>{isEditing ? 'Save' : 'Edit Profile'}</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Professional Info */}
        <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Professional Info</Text>
          <View style={[styles.infoCard, { backgroundColor: theme.surface, ...shadows }]}>
            <View style={styles.infoRow}>
              <Award size={moderateScale(20)} color={theme.primary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Experience (Years)</Text>
                {isEditing ? (
                  <TextInput 
                    style={[styles.input, { color: theme.text, borderBottomColor: theme.border }]}
                    value={profile.experience}
                    onChangeText={(txt) => setProfile({...profile, experience: txt})}
                    keyboardType="numeric"
                    placeholder="Enter years"
                  />
                ) : (
                  <Text style={[styles.infoValue, { color: theme.text }]}>{profile.experience} Years</Text>
                )}
              </View>
            </View>

            <View style={styles.infoRow}>
              <Activity size={moderateScale(20)} color={theme.primary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Operations Performed</Text>
                {isEditing ? (
                  <TextInput 
                    style={[styles.input, { color: theme.text, borderBottomColor: theme.border }]}
                    value={profile.operationsCount}
                    onChangeText={(txt) => setProfile({...profile, operationsCount: txt})}
                    placeholder="e.g., 500+"
                  />
                ) : (
                  <Text style={[styles.infoValue, { color: theme.text }]}>{profile.operationsCount}</Text>
                )}
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Specializations */}
        <Animated.View entering={FadeInDown.delay(150)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Specializations</Text>
            {isEditing && (
              <TouchableOpacity 
                onPress={handleAddSpecialization}
                style={[styles.addBtn, { backgroundColor: theme.primary }]}
              >
                <Plus size={moderateScale(14)} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.specializationContainer}>
            {specializations.map((spec) => (
              <View 
                key={spec.id} 
                style={[styles.specChip, { backgroundColor: theme.primary + '15', borderColor: theme.primary + '40' }]}
              >
                <Tag size={moderateScale(12)} color={theme.primary} />
                <Text style={[styles.specText, { color: theme.primary }]}>{spec.name}</Text>
                {isEditing && (
                  <TouchableOpacity
                    onPress={() => setSpecializations(specializations.filter(s => s.id !== spec.id))}
                  >
                    <X size={moderateScale(14)} color={theme.primary} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Education */}
        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Education</Text>
            {isEditing && (
              <TouchableOpacity 
                onPress={handleAddEducation}
                style={[styles.addBtn, { backgroundColor: theme.primary }]}
              >
                <Plus size={moderateScale(14)} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          {educations.map((edu, index) => (
            <View 
              key={edu.id} 
              style={[styles.infoCard, { backgroundColor: theme.surface, ...shadows, marginBottom: index < educations.length - 1 ? verticalScale(12) : 0 }]}
            >
              <View style={styles.infoRow}>
                <GraduationCap size={moderateScale(20)} color={theme.primary} />
                <View style={styles.infoContent}>
                  {isEditing ? (
                    <>
                      <TextInput 
                        style={[styles.input, { color: theme.text, borderBottomColor: theme.border }]}
                        value={edu.degree}
                        onChangeText={(txt) => {
                          const updated = [...educations];
                          updated[index].degree = txt;
                          setEducations(updated);
                        }}
                        placeholder="Degree (e.g., MBBS, MD)"
                      />
                      <TextInput 
                        style={[styles.input, { color: theme.text, borderBottomColor: theme.border, marginTop: verticalScale(8) }]}
                        value={edu.institution}
                        onChangeText={(txt) => {
                          const updated = [...educations];
                          updated[index].institution = txt;
                          setEducations(updated);
                        }}
                        placeholder="Institution"
                      />
                      <TextInput 
                        style={[styles.input, { color: theme.text, borderBottomColor: theme.border, marginTop: verticalScale(8) }]}
                        value={edu.year}
                        onChangeText={(txt) => {
                          const updated = [...educations];
                          updated[index].year = txt;
                          setEducations(updated);
                        }}
                        placeholder="Year"
                      />
                    </>
                  ) : (
                    <>
                      <Text style={[styles.infoValue, { color: theme.text }]}>{edu.degree}</Text>
                      <Text style={[styles.infoLabel, { color: theme.textSecondary, marginTop: verticalScale(2) }]}>{edu.institution} • {edu.year}</Text>
                    </>
                  )}
                </View>
                {isEditing && educations.length > 1 && (
                  <TouchableOpacity
                    onPress={() => setEducations(educations.filter(e => e.id !== edu.id))}
                  >
                    <Trash2 size={moderateScale(18)} color={theme.error || '#EF4444'} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </Animated.View>

        {/* Hospital Experience */}
        <Animated.View entering={FadeInDown.delay(250)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Hospital Experience</Text>
            {isEditing && (
              <TouchableOpacity 
                onPress={handleAddHospitalExperience}
                style={[styles.addBtn, { backgroundColor: theme.primary }]}
              >
                <Plus size={moderateScale(14)} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          {hospitalExperiences.map((exp, index) => (
            <View 
              key={exp.id} 
              style={[styles.infoCard, { backgroundColor: theme.surface, ...shadows, marginBottom: index < hospitalExperiences.length - 1 ? verticalScale(12) : 0 }]}
            >
              <View style={styles.infoRow}>
                <Building2 size={moderateScale(20)} color={theme.primary} />
                <View style={styles.infoContent}>
                  {isEditing ? (
                    <>
                      <TextInput 
                        style={[styles.input, { color: theme.text, borderBottomColor: theme.border }]}
                        value={exp.hospitalName}
                        onChangeText={(txt) => {
                          const updated = [...hospitalExperiences];
                          updated[index].hospitalName = txt;
                          setHospitalExperiences(updated);
                        }}
                        placeholder="Hospital Name"
                      />
                      <TextInput 
                        style={[styles.input, { color: theme.text, borderBottomColor: theme.border, marginTop: verticalScale(8) }]}
                        value={exp.position}
                        onChangeText={(txt) => {
                          const updated = [...hospitalExperiences];
                          updated[index].position = txt;
                          setHospitalExperiences(updated);
                        }}
                        placeholder="Position"
                      />
                      <TextInput 
                        style={[styles.input, { color: theme.text, borderBottomColor: theme.border, marginTop: verticalScale(8) }]}
                        value={exp.duration}
                        onChangeText={(txt) => {
                          const updated = [...hospitalExperiences];
                          updated[index].duration = txt;
                          setHospitalExperiences(updated);
                        }}
                        placeholder="Duration (e.g., 2014 - Present)"
                      />
                      <TextInput 
                        style={[styles.textArea, { color: theme.text, borderColor: theme.border, marginTop: verticalScale(8) }]}
                        multiline
                        value={exp.description}
                        onChangeText={(txt) => {
                          const updated = [...hospitalExperiences];
                          updated[index].description = txt;
                          setHospitalExperiences(updated);
                        }}
                        placeholder="Description"
                      />
                    </>
                  ) : (
                    <>
                      <Text style={[styles.infoValue, { color: theme.text }]}>{exp.hospitalName}</Text>
                      <Text style={[styles.infoLabel, { color: theme.textSecondary, marginTop: verticalScale(2) }]}>{exp.position} • {exp.duration}</Text>
                      {exp.description && (
                        <Text style={[styles.bioText, { color: theme.textSecondary, marginTop: verticalScale(4) }]}>{exp.description}</Text>
                      )}
                    </>
                  )}
                </View>
                {isEditing && hospitalExperiences.length > 1 && (
                  <TouchableOpacity
                    onPress={() => setHospitalExperiences(hospitalExperiences.filter(e => e.id !== exp.id))}
                  >
                    <Trash2 size={moderateScale(18)} color={theme.error || '#EF4444'} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </Animated.View>

        {/* About Me */}
        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>About Me</Text>
          <View style={[styles.infoCard, { backgroundColor: theme.surface, ...shadows }]}>
            {isEditing ? (
              <TextInput 
                style={[styles.textArea, { color: theme.text, borderColor: theme.border }]}
                multiline
                value={profile.bio}
                onChangeText={(txt) => setProfile({...profile, bio: txt})}
                placeholder="Describe yourself..."
              />
            ) : (
              <Text style={[styles.bioText, { color: theme.text }]}>{profile.bio}</Text>
            )}
          </View>
        </Animated.View>

        {/* Documents */}
        <Animated.View entering={FadeInDown.delay(350)} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Documents & Certificates</Text>
            {isEditing && (
              <TouchableOpacity 
                onPress={handleUploadDocument}
                style={[styles.addBtn, { backgroundColor: theme.primary }]}
                disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Upload size={moderateScale(14)} color="#fff" />
                )}
              </TouchableOpacity>
            )}
          </View>
          {documents.length === 0 ? (
            <View style={[styles.emptyDocCard, { backgroundColor: theme.surface, ...shadows }]}>
              <FileText size={moderateScale(32)} color={theme.textSecondary} />
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                {isEditing ? 'Upload your degrees and certificates' : 'No documents uploaded'}
              </Text>
            </View>
          ) : (
            documents.map((doc) => (
              <View 
                key={doc.id} 
                style={[styles.docCard, { backgroundColor: theme.surface, ...shadows }]}
              >
                <FileText size={moderateScale(20)} color={theme.primary} />
                <View style={styles.docInfo}>
                  <Text style={[styles.docName, { color: theme.text }]} numberOfLines={1}>{doc.name}</Text>
                  <Text style={[styles.docSize, { color: theme.textSecondary }]}>
                    {(doc.size / 1024 / 1024).toFixed(2)} MB
                  </Text>
                </View>
                {isEditing && (
                  <TouchableOpacity onPress={() => handleDeleteDocument(doc.id)}>
                    <Trash2 size={moderateScale(18)} color={theme.error || '#EF4444'} />
                  </TouchableOpacity>
                )}
              </View>
            ))
          )}
        </Animated.View>

        {/* Contact Details */}
        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact Details</Text>
          <View style={[styles.infoCard, { backgroundColor: theme.surface, ...shadows }]}>
            <View style={styles.infoRow}>
              <Mail size={moderateScale(20)} color={theme.primary} />
              <Text style={[styles.contactText, { color: theme.text }]}>{profile.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Phone size={moderateScale(20)} color={theme.primary} />
              <Text style={[styles.contactText, { color: theme.text }]}>{profile.phone}</Text>
            </View>
          </View>
        </Animated.View>

        <View style={{ height: verticalScale(30) }} />
      </ScrollView>
      <Toasts />
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: moderateScale(16),
  },
  profileHeader: {
    alignItems: 'center',
    padding: moderateScale(24),
    borderRadius: moderateScale(24),
    marginBottom: verticalScale(24),
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: verticalScale(16),
  },
  avatar: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImage: {
    width: moderateScale(100),
    height: moderateScale(100),
    borderRadius: moderateScale(50),
  },
  cameraBtn: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: moderateScale(32),
    height: moderateScale(32),
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: {
    fontSize: moderateScale(22),
    fontWeight: '900',
    marginBottom: verticalScale(4),
  },
  specialization: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginBottom: verticalScale(16),
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(12),
    gap: moderateScale(8),
  },
  editBtnText: {
    color: '#fff',
    fontSize: moderateScale(14),
    fontWeight: '700',
  },
  section: {
    marginBottom: verticalScale(24),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(12),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '800',
  },
  addBtn: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    padding: moderateScale(16),
    borderRadius: moderateScale(20),
    gap: verticalScale(16),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: moderateScale(16),
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: moderateScale(12),
    fontWeight: '600',
  },
  infoValue: {
    fontSize: moderateScale(15),
    fontWeight: '700',
    marginTop: verticalScale(2),
  },
  input: {
    fontSize: moderateScale(15),
    fontWeight: '600',
    paddingVertical: verticalScale(4),
    borderBottomWidth: 1,
  },
  bioText: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    fontWeight: '500',
  },
  textArea: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    fontWeight: '500',
    borderWidth: 1,
    borderRadius: moderateScale(12),
    padding: moderateScale(12),
    minHeight: verticalScale(100),
    textAlignVertical: 'top',
  },
  contactText: {
    fontSize: moderateScale(15),
    fontWeight: '600',
  },
  specializationContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(8),
  },
  specChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(12),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(20),
    borderWidth: 1,
    gap: moderateScale(6),
  },
  specText: {
    fontSize: moderateScale(13),
    fontWeight: '600',
  },
  emptyDocCard: {
    padding: moderateScale(32),
    borderRadius: moderateScale(20),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: verticalScale(120),
  },
  emptyText: {
    fontSize: moderateScale(14),
    fontWeight: '500',
    marginTop: verticalScale(12),
    textAlign: 'center',
  },
  docCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: moderateScale(16),
    borderRadius: moderateScale(16),
    marginBottom: verticalScale(12),
    gap: moderateScale(12),
  },
  docInfo: {
    flex: 1,
  },
  docName: {
    fontSize: moderateScale(14),
    fontWeight: '700',
    marginBottom: verticalScale(2),
  },
  docSize: {
    fontSize: moderateScale(12),
    fontWeight: '500',
  },
  settingsBtn: {
    padding: moderateScale(4),
  },
});

export default DoctorProfileScreen;
