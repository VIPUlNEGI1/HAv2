import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { ScreenWrapper } from '@/Components/ScreenWrapper';
import { useTheme } from '@/Theme/useTheme';
import { moderateScale, verticalScale } from '@/Helpers/Responsive';
import { User, Mail, Phone, Award, BookOpen, Edit2, Save } from 'lucide-react-native';

const DoctorProfileScreen = () => {
  const { theme, shadows } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState({
    name: 'Dr. Smith',
    specialization: 'Senior Cardiologist',
    experience: '12 Years',
    bio: 'Dedicated cardiologist with extensive experience in non-invasive cardiology and patient care.',
    email: 'dr.smith@hospital.com',
    phone: '+91 9876543210',
    education: 'MBBS, MD - Cardiology',
  });

  return (
    <ScreenWrapper title="Doctor Profile" showBack={true}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Header */}
        <View style={[styles.profileHeader, { backgroundColor: theme.surface, ...shadows }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: theme.primary + '20' }]}>
              <User size={moderateScale(50)} color={theme.primary} />
            </View>
            <TouchableOpacity 
              style={[styles.editBtn, { backgroundColor: theme.primary }]}
              onPress={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <Save size={16} color="#fff" /> : <Edit2 size={16} color="#fff" />}
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.name, { color: theme.text }]}>{profile.name}</Text>
          <Text style={[styles.specialization, { color: theme.primary }]}>{profile.specialization}</Text>
        </View>

        {/* Details Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Professional Info</Text>
          <View style={[styles.infoCard, { backgroundColor: theme.surface, ...shadows }]}>
            <View style={styles.infoRow}>
              <Award size={20} color={theme.primary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Experience</Text>
                {isEditing ? (
                  <TextInput 
                    style={[styles.input, { color: theme.text, borderBottomColor: theme.border }]}
                    value={profile.experience}
                    onChangeText={(txt) => setProfile({...profile, experience: txt})}
                  />
                ) : (
                  <Text style={[styles.infoValue, { color: theme.text }]}>{profile.experience}</Text>
                )}
              </View>
            </View>

            <View style={styles.infoRow}>
              <BookOpen size={20} color={theme.primary} />
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Education</Text>
                {isEditing ? (
                  <TextInput 
                    style={[styles.input, { color: theme.text, borderBottomColor: theme.border }]}
                    value={profile.education}
                    onChangeText={(txt) => setProfile({...profile, education: txt})}
                  />
                ) : (
                  <Text style={[styles.infoValue, { color: theme.text }]}>{profile.education}</Text>
                )}
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>About Me</Text>
          <View style={[styles.infoCard, { backgroundColor: theme.surface, ...shadows }]}>
            {isEditing ? (
              <TextInput 
                style={[styles.textArea, { color: theme.text, borderColor: theme.border }]}
                multiline
                value={profile.bio}
                onChangeText={(txt) => setProfile({...profile, bio: txt})}
              />
            ) : (
              <Text style={[styles.bioText, { color: theme.text }]}>{profile.bio}</Text>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact Details</Text>
          <View style={[styles.infoCard, { backgroundColor: theme.surface, ...shadows }]}>
            <View style={styles.infoRow}>
              <Mail size={20} color={theme.primary} />
              <Text style={[styles.contactText, { color: theme.text }]}>{profile.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Phone size={20} color={theme.primary} />
              <Text style={[styles.contactText, { color: theme.text }]}>{profile.phone}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  editBtn: {
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
  },
  specialization: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginTop: verticalScale(4),
  },
  section: {
    marginBottom: verticalScale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: '800',
    marginBottom: verticalScale(12),
  },
  infoCard: {
    padding: moderateScale(16),
    borderRadius: moderateScale(20),
    gap: verticalScale(16),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '700',
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
});

export default DoctorProfileScreen;
