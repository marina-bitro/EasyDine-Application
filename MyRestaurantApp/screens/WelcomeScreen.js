import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerBox}>
        <Image
          source={require('../assets/EasyDine.png')}
          style={styles.logo}
          resizeMode="cover"
        />

        <Text style={styles.title}>Welcome to EasyDine</Text>

        <Text style={styles.subtitle}>
          Log in and get your reservation booked in one tap!
        </Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <Text style={styles.footerQuote}>Your table is just a tap away 🍽️</Text>



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
  alignItems: 'center',
  justifyContent: 'center',
  height: '90%',
  width: '90%',
  maxHeight: 650,            
  maxWidth: 650,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 5 },
  elevation: 5,
},

  logo: {
    width: 130,
    height: 130,
    borderRadius: 40,
    marginBottom: 25,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3e2723',
    marginBottom: 30,
    textAlign:'center',
  },

  subtitle: {
    fontSize: 15,
    color: '#5d4037',
    textAlign: 'center',
    marginBottom: 60,
  },

  loginButton: {
    width: 250,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: 'rgb(231, 163, 142)',
    alignItems: 'center',
    marginBottom: 15,
  },

  signUpButton: {
    width: 250,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: 'rgb(153, 176, 125)',
    alignItems: 'center',
  },

  footerQuote: {
    fontSize: 12,
    color: '#a1887f',
    marginTop: 40,
    fontStyle: 'italic',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

});
