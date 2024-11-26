import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import Feather from 'react-native-vector-icons/Feather';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

// Define a type for the file object
type FileType = {
  uri: string;
  name: string;
  type: string;
  size?: number;
};

export default function AddSection() {
  const router = useRouter();
  const [sectionName, setSectionName] = useState('');
  const [file, setFile] = useState<FileType | null>(null);

  // Function to pick a file
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'],
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const { uri, name, mimeType, size } = result.assets[0];
        setFile({ uri, name, type: mimeType || 'application/octet-stream', size });
        Alert.alert('File Selected', `File Name: ${name}`);
      } else {
        Alert.alert('No file selected');
      }
    } catch (error) {
      console.error('Error selecting document:', error);
      Alert.alert('Error', 'An error occurred while selecting the file.');
    }
  };

  // Function to handle section creation
  const handleCreateSection = async () => {
    if (!sectionName || !file) {
      Alert.alert('Error', 'Please enter a section name and upload a file');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('sectionName', sectionName);

      const fileToUpload = {
        uri: file.uri.startsWith('file://') ? file.uri : `file://${file.uri}`,
        name: file.name,
        type: file.type || 'application/octet-stream',
      };

      formData.append('file', fileToUpload);
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        Alert.alert('Error', 'User is not authenticated');
        return;
      }

      const response = await axios.post(`${BASE_URL}/addSection`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.status === 'ok') {
        Alert.alert('Success', 'Section created successfully');
        setSectionName('');
        setFile(null);
        router.back();
      } else {
        Alert.alert('Error', response.data.message || 'Failed to create section');
      }
    } catch (error: any) {
      console.error('Upload Error:', error.message || error);
      Alert.alert('Error', error.response?.data?.message || 'An error occurred while creating the section');
    }
  };

  // Function to remove the selected file
  const removeFile = () => {
    setFile(null);
    Alert.alert('File Removed', 'The selected file has been removed.');
  };

  return (
    <View className="flex-1 p-6 bg-gray-100 pt-20 ">
      <TouchableOpacity onPress={() => router.back()} className="mr-4 flex-row items-center mb-6">
        <Feather name="arrow-left" size={30} color="#1E3A8A" />
      </TouchableOpacity>

      <Text className="text-2xl p-1 font-bold text-blue-950">Create New Section</Text>
      <Text className="text-lg p-1 mt-4 text-blue-950">Section Name:</Text>
      <TextInput
        placeholder="Enter Section Name"
        value={sectionName}
        onChangeText={(text) => setSectionName(text)}
        className="bg-white text-black rounded-md p-4 m-1 shadow mb-6"
        placeholderTextColor="#9CA3AF"
      />

      <View className="justify-center items-center ">
        <TouchableOpacity onPress={pickDocument} className="w-44 bg-blue-300 m-1 rounded-md py-2 items-center mb-4">
          <Text className="text-white text-lg">Upload File</Text>
        </TouchableOpacity>

        {file && (
          <View className=" w-80 m-2 bg-gray-200 rounded-md p-4 mb-6 flex-row justify-between items-center">
            <View className='flex-row items-center '>
            <Feather name="file" size={20} color="#1E3A8A" />
              <Text className="text-gray-700 text-lg ml-2">{file.name}</Text>
            </View>
            <TouchableOpacity onPress={removeFile} className="bg-red-500 p-2 rounded-full ml-4">
              <Feather name="x" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity onPress={handleCreateSection} className="w-44 m-1 bg-blue-950 rounded-md py-2 items-center shadow">
          <Text className="text-white text-lg">Create Section</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
