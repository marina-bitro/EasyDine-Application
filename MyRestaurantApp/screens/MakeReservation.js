import React, { useState } from 'react';
import { Platform, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MakeReservation({ route, navigation }) {
  const { restaurant } = route.params;

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [name, setName] = useState('');
  const [people, setPeople] = useState('');

  const MAX_ALLOWED = 15;

  //τοποθέτησε την ip διεύθυνση σου
  const API_BASE_URL = 'http://[YOUR_IP_ADDRESS]:3000';


  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const currentDate = selectedDate;
      setDate(prev => {
        const newDate = new Date(prev);
        newDate.setFullYear(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
        return newDate;
      });
      setShowTimePicker(true);
    }
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setDate(prev => {
        const newDate = new Date(prev);
        newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
        return newDate;
      });
    }
  };

  const checkAvailability = async () => {
    if (!name || !people) {
      Alert.alert('Παρακαλώ συμπλήρωσε όλα τα πεδία');
      return;
    }

    try {
      const res = await axios.get(`${API_BASE_URL}/api/reservations/check`, {
        params: {
          restaurant_id: restaurant.restaurant_id,
          date: date.toISOString(),
        },
      });

      if (res.data.count >= MAX_ALLOWED) {
        Alert.alert('Η ώρα αυτή είναι ήδη πλήρης');
      } else {
        handleSubmit();
      }
    } catch (error) {
      Alert.alert('Σφάλμα', 'Αποτυχία ελέγχου διαθεσιμότητας');
    }
  };

  const handleSubmit = async () => {
    try {
      
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Παρακαλώ κάνε σύνδεση πρώτα');
        return;
      }

      await axios.post(`${API_BASE_URL}/api/reservations`,
        {
          restaurant_id: restaurant.restaurant_id,
          reservation_date: date.toISOString(),
          reservation_people: people,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Alert.alert('Επιτυχία', 'Η κράτηση έγινε με επιτυχία!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Σφάλμα', error.response?.data?.message || 'Κάτι πήγε στραβά');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Κράτηση για: {restaurant.restaurant_name}</Text>

      <TextInput
        style={styles.input}
        placeholder="Όνομα"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Αριθμός ατόμων"
        value={people}
        onChangeText={setPeople}
        keyboardType="numeric"
      />

      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowDatePicker(true)}
      >
        <Text>{date.toLocaleString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={date}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onChangeTime}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={checkAvailability}>
        <Text style={styles.buttonText}>Υποβολή Κράτησης</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff8f2' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#3e2723' },
  input: {
    borderWidth: 1,
    borderColor: '#8d6e63',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#ff7043',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
