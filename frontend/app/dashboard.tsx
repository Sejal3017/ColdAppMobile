import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert,ScrollView } from 'react-native';
import { useRouter,  useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Feather from 'react-native-vector-icons/Feather';
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

type Section = {
  sectionName: string;
  studentNames: string[];
  _id: string; // Assuming MongoDB assigns an _id to each document
};


export default function Dashboard() {
  const router = useRouter();
  const [userData, setData] = useState({
    name: '',
    email: '',
    mobile: '',
  });
  const [menuVisible, setMenuVisible] = useState(false);
  const [sections, setSections] = useState<Section[]>([]);
  

  useEffect(() => {
    getUserData();
  }, []);

  // Fetch sections every time the screen is focused
  useFocusEffect(
    useCallback(() => {
      getSections(); // Fetch updated sections when the dashboard is focused
    }, [])
  );

  const getUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('token'); // Get JWT token from storage
      if (!token) {
        Alert.alert('Error', 'User is not authenticated');
        return;
      }

      // Make the POST request to your backend to fetch user data
      const response = await axios.post(`${BASE_URL}/userdata`, { token });

      if (response.data.status === 'ok') {
        const { name, email, mobile } = response.data.data; // Extract the name from the response
        setData({ name, email, mobile }); // Set the name in the state
      } else {
        Alert.alert('Error', response.data.message || 'Failed to fetch user data');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while fetching user data');
    }
  };
  const getSections = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'User is not authenticated');
        return;
      }

      const response = await axios.get(`${BASE_URL}/sections`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 'ok') {
        setSections(response.data.data as Section[]);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to fetch sections');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while fetching sections');
    }
  };


  // Function to handle logout
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token'); // Remove token from storage
    await AsyncStorage.removeItem('isLoggedIn'); // Mark user as logged out
    router.replace('/login'); // Navigate back to login screen
  };
  const getBackgroundColor = (index: number) => {
    if (index % 3 === 0) return 'bg-purple-200';
    if (index % 3 === 1) return 'bg-amber-200';
    return 'bg-blue-200';
  };
  
  
  return (
<View className="flex-1">
  {/* Header */}
  <View className="flex-row w-full pt-20 h-32 justify-between items-center px-6">
  <TouchableOpacity className= "" onPress={() => setMenuVisible(!menuVisible)}>
    <Feather name="menu" size={30} color="#1E3A8A" />
  </TouchableOpacity>
  
  <TouchableOpacity 
  className=" flex-row items-center px-4 py-2 bg-blue-200 rounded-md shadow"
  onPress={() => router.push('/addSection')}
> 
  <Text className="text-blue-950 font-semibold ">Add Section  </Text>
  <Feather name="plus" size={20} color="#1E3A8A" className="mr-2 " />
  
</TouchableOpacity>
</View>
{/* Hamburger Menu */}
{menuVisible && (
        <View className="absolute rounded-md left-0 w-full h-half bg-blue-950 px-6 py-6 z-10">
          {/* Header with Back Option */}
          <View className="flex-row items-center  pb-4 top-16 mb-20">
            <TouchableOpacity 
              className="flex-row items-center" 
              onPress={() => setMenuVisible(false)}>
              <Feather name="arrow-left" size={30} color="white"  />
              <Text className="text-white text-2xl ">  Home</Text>
            </TouchableOpacity>
          </View>
          {/* Personal Information Section */}
          <Text className="text-gray-400 text-base mb-2">Personal Information</Text>
          {/* Menu Items */}
          <TouchableOpacity onPress={() => console.log('Email clicked')} className="border-b  border-gray-500  items-start mb-4">
  <View className="w-full flex-row justify-between items-center ">
    <Text className="text-gray-300 text-lg font-bold ">Email</Text>
    <Feather name="chevron-right" size={20} color="white" />
  </View>
  <Text className="text-white text-lg mb-2">{userData.email}</Text>
</TouchableOpacity>

<TouchableOpacity onPress={() => console.log('Email clicked')} className="border-b  border-gray-500  items-start mb-4">
  <View className="w-full flex-row justify-between items-center">
    <Text className="text-gray-300 text-lg font-bold ">Name</Text>
    <Feather name="chevron-right" size={20} color="white" />
  </View>
  <Text className="text-white text-lg mb-2 ">{userData.name}</Text>
</TouchableOpacity>

<TouchableOpacity onPress={() => console.log('Email clicked')} className="border-b border-gray-500  items-start mb-4">
  <View className="w-full flex-row justify-between items-center ">
    <Text className="text-gray-300 text-lg font-bold">Mobile</Text>
    <Feather name="chevron-right" size={20} color="white" />
  </View>
  <Text className="text-white text-lg mb-2">{userData.mobile}</Text>
</TouchableOpacity>
      
          {/* Security Section */}
          <Text className="text-gray-400 text-base mb-2">Security</Text>
          <TouchableOpacity onPress={() => console.log('Email clicked')} className="border-b border-gray-500  items-start mb-4">
  <View className="w-full flex-row justify-between items-center">
    <Text className="text-gray-300 text-lg font-bold mb-2 ">Change Password</Text>
    <Feather name="chevron-right" size={20} color="white" />
  </View>
</TouchableOpacity>

          <TouchableOpacity 
            onPress={handleLogout} 
            className="bg-blue-300 rounded-lg px-6 py-3 items-center mt-4 mb-2"
          >
            <Text className="text-white text-lg font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>
      )}

  {/* Centered Content */}
  <View className="flex-1 top-8 p-4 ml-2  ">
    <Text className='font-bold text-blue-950 text-4xl mb-6'>Sections</Text>
    {/* Display sections */}
    <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
  {sections.map((section, index) => (
    <TouchableOpacity onPress={() =>
      router.push({
        pathname: '/sectionDetails',
        params: {
          sectionName: section.sectionName,
          studentNames: JSON.stringify(section.studentNames),
          sectionId: section._id,
        },
      })
    }
      key={index}
      className={`${getBackgroundColor(index)} mr-3 rounded-xl p-4 mb-8 shadow h-28 flex-row justify-between items-center`} // Use flex-row, justify-between, and items-center
    >
      {/* Left Content: Section Details */}
      <View>
        <Text className="text-blue-900 font-bold text-xl mb-2">{section.sectionName}</Text>
        <Text className="text-blue-900 text-lg">Students: {section.studentNames.length}</Text>
      </View>

      {/* Right Content: Chevron Icon */}
      <Feather name="chevron-right" size={28} color="#1E3A8A" />
    </TouchableOpacity>
  ))}
</ScrollView>
  </View>
</View>
   
  );
}

