import { useState, useMemo } from 'react';

export interface Document {
  id: string;
  patient: string;
  patientImage: string;
  name: string;
  date: string;
  size: number;
  type: 'pdf' | 'image' | 'other';
  uri: string;
}

const MOCK_DOCUMENTS: Document[] = [
  { id: '1', patient: 'John Doe', patientImage: 'https://i.pravatar.cc/150?u=john', name: 'Blood Report.pdf', date: 'Feb 5, 2026', size: 1200000, type: 'pdf', uri: 'file:///path/to/report1.pdf' },
  { id: '2', patient: 'John Doe', patientImage: 'https://i.pravatar.cc/150?u=john', name: 'X-Ray Chest.jpg', date: 'Feb 4, 2026', size: 2500000, type: 'image', uri: 'file:///path/to/xray1.jpg' },
  { id: '3', patient: 'Jane Smith', patientImage: 'https://i.pravatar.cc/150?u=jane', name: 'Prescription_Old.pdf', date: 'Jan 28, 2026', size: 500000, type: 'pdf', uri: 'file:///path/to/prescription1.pdf' },
  { id: '4', patient: 'Jane Smith', patientImage: 'https://i.pravatar.cc/150?u=jane', name: 'ECG Report.pdf', date: 'Feb 6, 2026', size: 800000, type: 'pdf', uri: 'file:///path/to/ecg1.pdf' },
  { id: '5', patient: 'Mike Johnson', patientImage: 'https://i.pravatar.cc/150?u=mike', name: 'MRI Scan.jpg', date: 'Feb 7, 2026', size: 5000000, type: 'image', uri: 'file:///path/to/mri1.jpg' },
];

export const useDoctorDocuments = () => {
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [showFilter, setShowFilter] = useState(false);

  const allDocuments = MOCK_DOCUMENTS;
  const filteredDocuments = useMemo(() => {
    if (!selectedPatient) return allDocuments;
    return allDocuments.filter((d) => d.patient === selectedPatient);
  }, [selectedPatient, allDocuments]);

  const patientFilters = useMemo(() => {
    const patients = Array.from(new Set(allDocuments.map((d) => d.patient)));
    return patients.map((p) => ({ label: p, value: p }));
  }, [allDocuments]);

  return {
    selectedPatient,
    setSelectedPatient,
    showFilter,
    setShowFilter,
    documents: filteredDocuments,
    allDocuments,
    patientFilters,
  };
};
