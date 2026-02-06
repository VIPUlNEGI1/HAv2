import { useState, useMemo } from 'react';

const DOCTORS_DATA = [
  { id: '1', name: 'Dr. Arpita Shah', specialty: 'Cardiologist', exp: '12 yrs', rating: 4.9, price: 800, image: 'https://img.freepik.com/free-photo/woman-doctor-wearing-lab-coat-with-stethoscope-isolated_1303-29791.jpg' },
  { id: '2', name: 'Dr. Sameer Khan', specialty: 'Dermatologist', exp: '8 yrs', rating: 4.7, price: 600, image: 'https://img.freepik.com/free-photo/pleased-young-female-doctor-wearing-medical-robe-with-stethoscope-around-neck-standing-with-folded-arms_409827-254.jpg' },
  { id: '3', name: 'Dr. Rahul Verma', specialty: 'Pediatrician', exp: '15 yrs', rating: 5.0, price: 1000, image: 'https://img.freepik.com/free-photo/portrait-smiling-handsome-male-doctor-man_171337-5055.jpg' },
  { id: '4', name: 'Dr. Priya Mani', specialty: 'Cardiologist', exp: '10 yrs', rating: 4.8, price: 900, image: 'https://img.freepik.com/free-photo/doctor-with-co-workers-analyzing-x-ray_1098-581.jpg' },
  { id: '5', name: 'Dr. Amit Singh', specialty: 'General Physician', exp: '5 yrs', rating: 4.5, price: 400, image: 'https://img.freepik.com/free-photo/smiling-doctor-with-stethoscope_23-2147661402.jpg' },
];

const SPECIALTIES = ['All', 'Cardiologist', 'Dermatologist', 'Pediatrician', 'General Physician'];

export const useDoctors = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [minRating, setMinRating] = useState(0);

  const filteredDoctors = useMemo(() => {
    return DOCTORS_DATA.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
      const matchesPrice = doc.price <= maxPrice;
      const matchesRating = doc.rating >= minRating;
      return matchesSearch && matchesSpecialty && matchesPrice && matchesRating;
    });
  }, [searchQuery, selectedSpecialty, maxPrice, minRating]);

  return {
    searchQuery,
    setSearchQuery,
    selectedSpecialty,
    setSelectedSpecialty,
    maxPrice,
    setMaxPrice,
    minRating,
    setMinRating,
    filteredDoctors,
    specialties: SPECIALTIES,
  };
};
