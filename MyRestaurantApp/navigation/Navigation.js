import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import Screens
import WelcomeScreen from '../screens/WelcomeScreen';
import HomeScreen from '../screens/HomeScreen';
import SignUp from '../screens/SignUp';
import Login from '../screens/Login';
import RestaurantDetails from '../screens/RestaurantDetails';
import MakeReservation from '../screens/MakeReservation';
import UserProfile from '../screens/UserProfile';


const Stack = createStackNavigator();

export default function Navigation() {

  return (
    <NavigationContainer>


      <Stack.Navigator initialRouteName="WelcomeScreen">

        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }}/>

        <Stack.Screen name="Login" component={Login} options={{ title: 'Σύνδεση' }} />
       
        <Stack.Screen name="SignUp" component={SignUp} options={{ title: 'Εγγραφή' }} />



        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Αρχική', headerLeft: () => null }} />



        <Stack.Screen name="RestaurantDetails" component={RestaurantDetails} options={{ title: 'Λεπτομέρειες' }} />

        <Stack.Screen name="MakeReservation" component={MakeReservation} options={{ title: 'Κράτηση' }} />

        <Stack.Screen name="UserProfile" component={UserProfile} options={{ title: 'Προφίλ Χρήστη' }} /> 


      </Stack.Navigator>

    </NavigationContainer>
  );

}
