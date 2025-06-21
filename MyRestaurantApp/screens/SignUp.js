import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';

export default function SignUp({ navigation }) {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  //τοποθέτησε την ip διεύθυνση σου
  const API_BASE_URL = 'http://[YOUR_IP_ADDRESS]:3000';


  const handleRegister = async () => {

    try {
      await axios.post(`${API_BASE_URL}/api/auth/register`, {
        name,
        password,
      });

      Alert.alert('Επιτυχής εγγραφή!');
      navigation.navigate('Home');
    } catch (err) {
      Alert.alert('Σφάλμα', err.response?.data?.message || 'Κάτι πήγε στραβά.');
    }
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerBox}>
        <Text style={styles.title}>Δημιουργία Λογαριασμού</Text>

        <TextInput
          style={styles.input}
          placeholder="Όνομα"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Κωδικός"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Εγγραφή</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Έχεις ήδη λογαριασμό; Σύνδεση</Text>
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
    backgroundColor: 'rgb(153, 176, 125)',
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

