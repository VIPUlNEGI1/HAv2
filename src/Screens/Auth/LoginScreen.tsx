import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '@/hooks/superbase';
import { useAuthStore } from '@/hooks/useAuthStore';

const LoginScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore(state => state.setAuth);

  const handleLogin = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Check existing user
      const { data: existingUser, error } = await supabase
        .from('login')
        .select('*')
        .eq('phone_number', phoneNumber)
        .maybeSingle();

      if (error) throw error;

      if (existingUser) {
        console.log('User found:', existingUser);
        setAuth(existingUser, 'dummy-token');
        return;
      }

      // 2️⃣ Register new user
      if (!name.trim()) {
        Alert.alert('Info', 'Please enter your name');
        return;
      }

      const { data: newUser, error: insertError } = await supabase
        .from('login')
        .insert({
          phone_number: phoneNumber,
          name: name.trim(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      console.log('New user registered:', newUser);
      setAuth(newUser, 'dummy-token');
    } catch (err: any) {
      Alert.alert('Login Failed', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Chat</Text>

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      <TextInput
        style={styles.input}
        placeholder="Your Name (first time only)"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login / Register</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#4B2A99',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#4B2A99',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
