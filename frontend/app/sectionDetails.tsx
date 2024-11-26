import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity,Alert,Modal  } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Feather from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export default function SectionDetails() {
  const router = useRouter();
  const { sectionName, studentNames, sectionId } = useLocalSearchParams();
  const parsedStudentNames = JSON.parse(studentNames as string);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');


  
  const generateRandomStudent = () => {
    if (parsedStudentNames.length === 0) {
      setSelectedStudent('No students available');
      setModalVisible(true);
      return;
    }
    const randomIndex = Math.floor(Math.random() * parsedStudentNames.length);
    const randomStudent = parsedStudentNames[randomIndex];
    setSelectedStudent(randomStudent); // Set the selected student
    setModalVisible(true); // Show the modal
  };

  const handleDeleteSection = async () => {
    Alert.alert(
      'Confirm Deletion',
      'Are you sure you want to delete this section?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              if (!token) {
                Alert.alert('Error', 'User is not authenticated');
                return;
              }

              // Call the backend to delete the section
              const response = await axios.delete(
                `${BASE_URL}/deleteSection/${sectionId}`, // Send the sectionId in the API request
                {
                  headers: {
                    Authorization: `Bearer ${token}`, // Include the JWT token in the headers
                  },
                }
              );

              if (response.data.status === 'ok') {
                Alert.alert('Success', 'Section deleted successfully');
                router.replace('/dashboard'); // Redirect to the dashboard after deletion
              } else {
                Alert.alert('Error', response.data.message || 'Failed to delete section');
              }
            } catch (error) {
              console.error('Deletion Error:', error);
              Alert.alert('Error', 'An error occurred while deleting the section');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View className="flex-1 p-6 bg-gray-100 pt-20">
      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} className="flex-row items-center mb-6">
        <Feather name="arrow-left" size={30} color="#1E3A8A" />
        
      </TouchableOpacity>

      {/* Section Title */}
      <View className="flex-row justify-between  p-1 items-center mb-6">
        <Text className="text-blue-950 font-bold text-4xl">{sectionName}</Text>
        <TouchableOpacity onPress={handleDeleteSection}>
  <Feather name="trash-2" size={28} color="#E53E3E" /> 
</TouchableOpacity>
      </View>
      {/* <Text className="flex-1 top-8 p-2 ml-2 text-blue-950 font-bold text-4xl mb-6 mt-4">{sectionName}</Text> */}

      {/* Student List */}
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {Array.isArray(parsedStudentNames) && parsedStudentNames.map((name, index) => (
          <View key={index} className="bg-blue-100 rounded-md p-4 mb-2 shadow">
            <Text className="text-blue-900 font-bold text-lg">{name}</Text>
          </View>
        ))}
      </ScrollView>
       {/* Footer Container for Generate Random Student Button */}
       <View className="w-full px-4 py-10  shadow-lg">
        <TouchableOpacity
          onPress={generateRandomStudent}
          className="bg-blue-950 rounded-md p-4 items-center shadow"
        >
          <Text className="text-white font-bold text-lg">Generate Random Student</Text>
        </TouchableOpacity>
      </View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/60">
          <View className="w-4/5 bg-white rounded-lg p-6 items-center shadow-lg">
            <Text className="text-xl font-bold text-blue-900 mb-4">Student Selected</Text>
            <Text className="text-3xl text-gray-700 mb-6">{selectedStudent}</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="bg-blue-950 rounded-md px-6 py-3"
            >
              <Text className="text-white text-lg font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
    
  );
}
