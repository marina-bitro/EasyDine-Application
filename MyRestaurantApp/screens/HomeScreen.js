import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
  TextInput,
  ScrollView
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';



export default function HomeScreen({ navigation }) {

  // για να κάνει fetch κάθε φορά που πάμε στην HomeScreen
  const isFocused = useIsFocused();

  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  //τοποθέτησε την ip διεύθυνση σου
  const API_BASE_URL = 'http://[YOUR_IP_ADDRESS]:3000';


  useEffect(() => {

    const fetchRestaurants = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/restaurants`);
        setRestaurants(res.data);
        setFilteredRestaurants(res.data);
      } catch (err) {
        console.error('Error fetching restaurants:', err.message);
        Alert.alert('Σφάλμα', 'Αποτυχία φόρτωσης εστιατορίων');
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) {
      fetchRestaurants();
    }

  }, [isFocused]);


  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      Alert.alert('Έγινε αποσύνδεση');
      navigation.replace('WelcomeScreen');
    } catch (e) {
      Alert.alert('Σφάλμα', 'Αποτυχία αποσύνδεσης');
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = restaurants.filter((r) =>
      r.restaurant_name.toLowerCase().includes(text.toLowerCase()) ||
      r.restaurant_street_id.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredRestaurants(filtered);
  };


  const HorizontalRestaurantCard = ({ item, navigation }) => (

    <TouchableOpacity
      style={styles.horizontalCard}
      onPress={() => navigation.navigate('RestaurantDetails', { restaurant: item })}
    >

      <Image source={{ uri: item.restaurant_image }} style={styles.cardImage} />

      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.restaurant_name}</Text>
        <Text style={styles.location}>Οδός: {item.restaurant_street_id}</Text>
        <Text style={styles.seats}>Διαθέσιμες Θέσεις: {item.available_seats}</Text>
      </View>
    </TouchableOpacity>
  );

  const VerticalRestaurantCard = ({ item, navigation }) => (
    <TouchableOpacity
      style={styles.verticalCard}
      onPress={() => navigation.navigate('RestaurantDetails', { restaurant: item })}
    >

      <Image source={{ uri: item.restaurant_image }} style={styles.cardImage} />

      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.restaurant_name}</Text>
        <Text style={styles.location}>Οδός: {item.restaurant_street_id}</Text>
        <Text style={styles.seats}>Διαθέσιμες Θέσεις: {item.available_seats}</Text>
      </View>
    </TouchableOpacity>
  );


  const chunkArray = (array, size) => {
    return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
      array.slice(i * size, i * size + size)
    );
  };



  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ff7043" />
      </View>
    );
  }

  return (

    <View style={styles.view}>

      <View style={styles.navbar}>
        <TouchableOpacity onPress={() => navigation.navigate('UserProfile')} style={styles.navButton}>
          <Text style={styles.navButtonText}>👤 Προφίλ</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleLogout} style={styles.navButton}>
          <Text style={styles.navButtonText}> Αποσύνδεση</Text>
        </TouchableOpacity>
      </View>


      <TextInput
        placeholder="Αναζήτησε εστιατόριο..."
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <View style={styles.horizontalListContainer}>

        <Text style={styles.sectionTitle}>Top Restaurants</Text>

        <FlatList
          data={filteredRestaurants.slice(0, 10)}
          keyExtractor={(item) => 'horizontal_' + item.restaurant_id}
          renderItem={({ item }) => (
            <HorizontalRestaurantCard item={item} navigation={navigation} />
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
        />



      </View>


      <Text style={styles.sectionTitle}>All Restaurants</Text>


      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 5, paddingRight: 10, paddingBottom: 20, marginBottom: 30 }} >
        {chunkArray(filteredRestaurants, 2).map((row, rowIndex) => (

          <View style={styles.row} key={rowIndex}>
            {row.map((item) => (
              <VerticalRestaurantCard
                key={item.restaurant_id}
                item={item}
                navigation={navigation}
              />
            ))}
          </View>

        ))}
      </ScrollView>


      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>© 2025 EasyDine App</Text>
      </View>

    </View>

  );
}


const styles = StyleSheet.create({

  view: {
    flex: 1,
    backgroundColor: '#fff8f2',
  },

  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff3e0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  navButton: {
    backgroundColor: '#ff7043',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  navButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },


  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3e2723',
    marginTop: 10,
    padding: 10,
  },
  searchInput: {
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 25,
    marginVertical: 10,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    fontSize: 16,
    color: ' #333',
    shadowColor: ' #000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  horizontalListContainer: {
    minHeight: 180,
    marginBottom: 20,
    padding: 10,
  },


  cardImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  horizontalCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    width: 280,
    marginRight: 10,
    padding: 10,
  },


  row: {
    flexDirection: 'row',
    paddingBottom: 15,
    paddingRight: 25,
  },

  verticalCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginLeft: 10,
    padding: 10,
    width: '50%', // για 2 σε μια σειρά 
  },

  verticalListContainer: {
    paddingBottom: 20,
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5d4037',
  },
  location: {
    fontSize: 12,
    color: '#8d6e63',
  },
  seats: {
    fontSize: 12,
    color: '#8d6e63',
  },


  footerContainer: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f5e9e2',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#a1887f',
  },
});