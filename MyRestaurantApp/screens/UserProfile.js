import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserProfile() {

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Για edit mode
  const [editingId, setEditingId] = useState(null);
  const [editPeople, setEditPeople] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');


  //τοποθέτησε την ip διεύθυνση σου
  const API_BASE_URL = 'http://[YOUR_IP_ADDRESS]:3000';



  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await axios.get(`${API_BASE_URL}/api/user/reservations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReservations(res.data);
    } catch (error) {
      Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η φόρτωση των κρατήσεων');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.delete(`${API_BASE_URL}/api/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Επιτυχία', 'Η κράτηση διαγράφηκε');
      fetchReservations();
    } catch (error) {
      Alert.alert('Σφάλμα', 'Δεν ήταν δυνατή η διαγραφή');
    }
  };

  const startEdit = (item) => {
    let dateTimeStr = item.reservation_date;

    // Μετατρέπουμε το ISO σε "YYYY-MM-DD HH:mm:ss"
    dateTimeStr = dateTimeStr.replace('T', ' ').split('.')[0];

    const [datePart, timePart] = dateTimeStr.split(' ');
    const timeString = timePart.substring(0, 5);

    setEditingId(item.reservation_id);
    setEditPeople(String(item.reservation_people));
    setEditDate(datePart);
    setEditTime(timeString);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditPeople('');
    setEditDate('');
    setEditTime('');
  };

  const saveEdit = async (id) => {
    if (!editPeople || !editDate) {
      Alert.alert('Παρακαλώ συμπλήρωσε όλα τα πεδία');
      return;
    }
    try {
      let fullDateTime;

      if (editTime.trim() === '') {
        // Αν δεν αλλάξει η ώρα, κρατάμε την παλιά ώρα από την αρχική κράτηση
        const existing = reservations.find(r => r.reservation_id === id);
        const oldTime = new Date(existing.reservation_date);
        const hours = oldTime.getHours().toString().padStart(2, '0');
        const minutes = oldTime.getMinutes().toString().padStart(2, '0');
        fullDateTime = `${editDate} ${hours}:${minutes}:00`;
      } else {
        fullDateTime = `${editDate} ${editTime}:00`;
      }

      const token = await AsyncStorage.getItem('userToken');

      await axios.put(`${API_BASE_URL}/api/reservations/${id}`,
        { reservation_people: editPeople, reservation_date: fullDateTime },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Επιτυχία', 'Η κράτηση ενημερώθηκε');
      cancelEdit();
      fetchReservations();
    } catch (error) {
      console.log('Axios error:', error?.response?.data || error.message);
      Alert.alert('Σφάλμα', error?.response?.data?.message || error.message || 'Δεν ήταν δυνατή η ενημέρωση');

    }
  };

  const renderItem = ({ item }) => {
    if (editingId === item.reservation_id) {
      return (
        <View style={styles.card}>
          <Text>Επεξεργασία κράτησης #{item.reservation_id}</Text>

          <TextInput
            style={styles.input}
            value={editPeople}
            onChangeText={setEditPeople}
            keyboardType="numeric"
            placeholder="Άτομα"
          />
          <TextInput
            style={styles.input}
            value={editDate}
            onChangeText={setEditDate}
            placeholder="Ημερομηνία (π.χ. 2025-05-20)"
          />
          <TextInput
            style={styles.input}
            value={editTime}
            onChangeText={setEditTime}
            placeholder="Ώρα (π.χ. 20:30)"
          />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => saveEdit(item.reservation_id)} style={styles.button}>
              <Text style={styles.buttonText}>Αποθήκευση</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={cancelEdit} style={[styles.button, { backgroundColor: '#aaa' }]}>
              <Text style={styles.buttonText}>Άκυρο</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.card}>

        <Text>Εστιατόριο: {item.restaurant_name}</Text>
        <Text>Κράτηση #{item.reservation_id}</Text>

        {(() => {
          const dateTimeStr = item.reservation_date.replace('T', ' ').split('.')[0];
          const [datePart, timePart] = dateTimeStr.split(' ');
          const [hour, minute] = timePart.split(':');

          return (
            <>
              <Text>Ημερομηνία: {datePart}</Text>
              <Text>Ώρα: {hour}:{minute}</Text>
            </>
          );
        })()}


        <Text>Άτομα: {item.reservation_people}</Text>

        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <TouchableOpacity onPress={() => startEdit(item)} style={[styles.button, { marginRight: 10 }]}>
            <Text style={styles.buttonText}>Επεξεργασία</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.reservation_id)} style={[styles.button, { backgroundColor: '#d9534f' }]}>
            <Text style={styles.buttonText}>Διαγραφή</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Οι Κρατήσεις μου</Text>
      {loading ? (
        <Text>Φόρτωση...</Text>
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.reservation_id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff8f2' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#3e2723' },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  button: {
    backgroundColor: '#ff7043',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#8d6e63',
    borderRadius: 8,
    padding: 8,
    marginVertical: 10,
    backgroundColor: '#fff',
  },
});
