import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  //τοποθέτησε την ip διεύθυνση σου
  const API_BASE_URL = 'http://[YOUR_IP_ADDRESS]:3000';


  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/auth/login`, { name, password });

      const token = response.data.token;
      await AsyncStorage.setItem('userToken', token);
      Alert.alert('Επιτυχής σύνδεση!');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Σφάλμα', error.response?.data?.message || 'Κάτι πήγε στραβά');
    }
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerBox}>
        <Text style={styles.title}>Σύνδεση</Text>

        <TextInput
          placeholder="Όνομα"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Κωδικός"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Σύνδεση</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.linkText}>Δεν έχεις λογαριασμό; Κάνε εγγραφή</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#fef4ea',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  innerBox: {
    backgroundColor: '#fffdf8',
    borderRadius: 20,
    padding: 30,
    width: '90%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3e2723',
    marginBottom: 25,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: 'rgb(231, 163, 142)',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkText: {
    color: '#5d4037',
    marginTop: 10,
  },
});

