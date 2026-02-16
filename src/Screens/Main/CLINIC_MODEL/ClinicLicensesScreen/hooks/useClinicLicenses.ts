import { useState } from 'react';

export interface License {
  id: string;
  name: string;
  number: string;
  expiryDate: string;
  document?: string;
}

const INITIAL_LICENSES: License[] = [
  { id: '1', name: 'Clinic Registration', number: 'CL-2024-001', expiryDate: '2025-12-31' },
  { id: '2', name: 'Pharmacy License', number: 'PH-2024-045', expiryDate: '2025-06-30' },
];

export const useClinicLicenses = () => {
  const [licenses, setLicenses] = useState<License[]>(INITIAL_LICENSES);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLicense, setNewLicense] = useState({
    name: '',
    number: '',
    expiryDate: '',
    document: '',
  });

  const handleAddLicense = (onSuccess?: () => void, onError?: (msg: string) => void) => {
    if (!newLicense.name || !newLicense.number || !newLicense.expiryDate) {
      onError?.('Please fill all required fields');
      return;
    }
    const license: License = {
      id: Date.now().toString(),
      name: newLicense.name,
      number: newLicense.number,
      expiryDate: newLicense.expiryDate,
      document: newLicense.document || undefined,
    };
    setLicenses((prev) => [...prev, license]);
    setNewLicense({ name: '', number: '', expiryDate: '', document: '' });
    setShowAddModal(false);
    onSuccess?.();
  };

  const handleDeleteLicense = (
    id: string,
    onConfirm: () => void,
    onSuccess?: () => void
  ) => {
    setLicenses((prev) => prev.filter((l) => l.id !== id));
    onSuccess?.();
  };

  const resetNewLicense = () => {
    setNewLicense({ name: '', number: '', expiryDate: '', document: '' });
  };

  return {
    licenses,
    showAddModal,
    setShowAddModal,
    newLicense,
    setNewLicense,
    handleAddLicense,
    handleDeleteLicense,
    resetNewLicense,
  };
};
