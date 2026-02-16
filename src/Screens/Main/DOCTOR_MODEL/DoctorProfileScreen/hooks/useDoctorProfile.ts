import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { launchImageLibrary, launchCamera, ImagePickerResponse, MediaType } from 'react-native-image-picker';
import { toast } from '@backpackapp-io/react-native-toast';
import { useAPICall } from '@/hooks/useAPICall';
import { ApiRoutes } from '@/api/routes';
import { useRoleStore } from '@/hooks/useRoleStore';

export interface DocDocument {
  id: string;
  name: string;
  type: string;
  uri: string;
  size: number;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string;
}

export interface HospitalExperience {
  id: string;
  hospitalName: string;
  position: string;
  duration: string;
  description: string;
}

export interface Specialization {
  id: string;
  name: string;
}

const pickDocument = () =>
  new Promise<{ name: string; type: string; uri: string; size: number }>((resolve) => {
    setTimeout(() => resolve({ name: 'Degree_Certificate.pdf', uri: 'file:///path/to/document.pdf', type: 'application/pdf', size: 1024000 }), 500);
  });

const defaultProfile = {
  name: 'Dr. Smith',
  specialization: 'Senior Cardiologist',
  experience: '12',
  bio: 'Dedicated cardiologist with extensive experience in non-invasive cardiology and patient care. Committed to providing the highest quality healthcare.',
  email: 'dr.smith@hospital.com',
  phone: '+91 9876543210',
  operationsCount: '500+',
  image: null as string | null,
};

export const useDoctorProfile = () => {
  const { APICall } = useAPICall();
  const currentRole = useRoleStore((s) => s.currentRole);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profile, setProfile] = useState(defaultProfile);
  const [educations, setEducations] = useState<Education[]>([
    { id: '1', degree: 'MBBS', institution: 'AIIMS Delhi', year: '2010' },
    { id: '2', degree: 'MD - Cardiology', institution: 'AIIMS Delhi', year: '2014' },
  ]);
  const [hospitalExperiences, setHospitalExperiences] = useState<HospitalExperience[]>([
    { id: '1', hospitalName: 'Apollo Hospital', position: 'Senior Cardiologist', duration: '2014 - Present', description: 'Leading cardiac care unit, performed 300+ successful surgeries' },
  ]);
  const [specializations, setSpecializations] = useState<Specialization[]>([
    { id: '1', name: 'Cardiology' },
    { id: '2', name: 'Cardiac Surgery' },
    { id: '3', name: 'Interventional Cardiology' },
  ]);
  const [documents, setDocuments] = useState<DocDocument[]>([]);

  const fetchProfile = useCallback(async () => {
    if (currentRole !== 'doctor') return;
    setLoading(true);
    const res = await APICall<{ success?: boolean; data?: Record<string, unknown> }>(
      'get',
      null,
      ApiRoutes.doctors.profile,
    );
    setLoading(false);
    if (res.status === 200 && res.data?.data) {
      const d = res.data.data as Record<string, unknown>;
      const user = (d.user_id as Record<string, unknown>) || {};
      setProfile({
        name: (user.name as string) || defaultProfile.name,
        specialization: (d.specialization as string) || defaultProfile.specialization,
        experience: String(d.experience_years ?? defaultProfile.experience),
        bio: (d.bio as string) || defaultProfile.bio,
        email: (d.email as string) || (user.email as string) || defaultProfile.email,
        phone: (d.phone as string) || (user.phone_number as string) || defaultProfile.phone,
        operationsCount: (d.operations_count as string) || defaultProfile.operationsCount,
        image: (d.avatar_url as string) || null,
      });
      const ed = (d.education as Array<Record<string, unknown>>) || [];
      setEducations(ed.map((e, i) => ({
        id: String(i + 1),
        degree: (e.degree as string) || '',
        institution: (e.institution as string) || '',
        year: (e.year as string) || '',
      })));
      const exp = (d.experience as Array<Record<string, unknown>>) || [];
      setHospitalExperiences(exp.map((e, i) => ({
        id: String(i + 1),
        hospitalName: (e.hospital_name as string) || '',
        position: (e.position as string) || '',
        duration: (e.duration as string) || '',
        description: (e.description as string) || '',
      })));
      const cat = (d.categories as string[]) || [];
      setSpecializations(cat.map((name, i) => ({ id: String(i + 1), name })));
    }
  }, [APICall, currentRole]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleImagePicker = () => {
    Alert.alert('Select Image', 'Choose an option', [
      { text: 'Camera', onPress: () => openCamera() },
      { text: 'Gallery', onPress: () => openGallery() },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const openCamera = () => {
    launchCamera({ mediaType: 'photo' as MediaType, quality: 0.8, maxWidth: 800, maxHeight: 800 }, (response: ImagePickerResponse) => {
      if (response.assets?.[0]) setProfile((p) => ({ ...p, image: response.assets![0].uri || null })); toast.success('Profile image updated!');
    });
  };

  const openGallery = () => {
    launchImageLibrary({ mediaType: 'photo' as MediaType, quality: 0.8, maxWidth: 800, maxHeight: 800 }, (response: ImagePickerResponse) => {
      if (response.assets?.[0]) setProfile((p) => ({ ...p, image: response.assets![0].uri || null })); toast.success('Profile image updated!');
    });
  };

  const handleUploadDocument = async () => {
    try {
      setUploading(true);
      const doc = await pickDocument();
      setDocuments((prev) => [...prev, { id: Date.now().toString(), name: doc.name, type: doc.type, uri: doc.uri, size: doc.size }]);
      toast.success('Document uploaded successfully!');
    } catch {
      toast.error('Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = (id: string) => {
    Alert.alert('Delete Document', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { setDocuments((prev) => prev.filter((doc) => doc.id !== id)); toast.success('Document deleted'); } },
    ]);
  };

  const handleAddEducation = () => setEducations((prev) => [...prev, { id: Date.now().toString(), degree: '', institution: '', year: '' }]);
  const handleAddHospitalExperience = () => setHospitalExperiences((prev) => [...prev, { id: Date.now().toString(), hospitalName: '', position: '', duration: '', description: '' }]);
  const handleAddSpecialization = () => {
    Alert.prompt('Add Specialization', 'Enter specialization name', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Add', onPress: (text?: string) => text?.trim() && setSpecializations((prev) => [...prev, { id: Date.now().toString(), name: text!.trim() }]) },
    ], 'plain-text');
  };
  const handleSave = async () => {
    if (currentRole !== 'doctor') {
      setIsEditing(false);
      toast.success('Profile updated successfully!');
      return;
    }
    const body: Record<string, unknown> = {
      specialization: profile.specialization,
      experience_years: Number(profile.experience) || 0,
      bio: profile.bio,
      email: profile.email,
      phone: profile.phone,
      operations_count: profile.operationsCount,
      education: educations.map((e) => ({ degree: e.degree, institution: e.institution, year: e.year })),
      experience: hospitalExperiences.map((e) => ({
        hospital_name: e.hospitalName,
        position: e.position,
        duration: e.duration,
        description: e.description,
      })),
      categories: specializations.map((s) => s.name),
    };
    const res = await APICall<{ success?: boolean }>('put', body, ApiRoutes.doctors.profile);
    setIsEditing(false);
    if (res.status === 200) {
      toast.success('Profile updated successfully!');
    } else {
      toast.error((res.data as { message?: string })?.message || 'Failed to update profile');
    }
  };

  return {
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
    loading,
    refetch: fetchProfile,
    handleImagePicker,
    openCamera,
    openGallery,
    handleUploadDocument,
    handleDeleteDocument,
    handleAddEducation,
    handleAddHospitalExperience,
    handleAddSpecialization,
    handleSave,
  };
};
