import React, { useState } from 'react';
import { TouchableOpacity, Text, View, ScrollView, Image, StyleSheet } from 'react-native';



export default function RestaurantDetails({ route, navigation }) {
  const { restaurant } = route.params;
  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Image source={{ uri: restaurant.restaurant_image }} style={styles.image} />

      <Text style={styles.title}>{restaurant.restaurant_name}</Text>

      <View style={styles.infoBox}>
        <View style={styles.infoRow}>
          <Text style={styles.label}> Περιγραφή: </Text>
          <Text style={styles.value}>{restaurant.restaurant_description}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}> Διεύθυνση: </Text>
          <Text style={styles.value}>{restaurant.restaurant_street_id}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}> Θέσεις: </Text>
          <Text style={styles.value}>{restaurant.available_seats}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MakeReservation', { restaurant })}
      >
        <Text style={styles.buttonText}>Κάνε Κράτηση</Text>
      </TouchableOpacity>

      <Text style={styles.footerNote}>🍽️ Κλείσε τώρα και απόλαυσε την εμπειρία!</Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff8f2',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#5d4037',
    marginBottom: 20,
    textAlign: 'center',
  },

  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
    alignItems: 'flex-start',
  },

  infoBox: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
    elevation: 2,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#795548',
  },
  value: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#6d4c41',
  },
  button: {
    backgroundColor: '#ff7043',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  footerNote: {
    marginTop: 20,
    fontSize: 14,
    color: '#a1887f',
    textAlign: 'center',
  },
});
