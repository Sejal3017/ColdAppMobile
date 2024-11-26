import React, { useState } from 'react';
import { Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Image} from 'react-native';
import { Feather } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';
import axios from 'axios';
const { ScrollView }  = require('react-native');
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;


export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [nameVerify,setNameVerify] = useState(false);
  const [email, setEmail] = useState('');
  const [emailVerify,setEmailVerify] = useState(false);
  const [mobile, setMobile] = useState('');
  const [mobileVerify,setMobileVerify] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordVerify,setPasswordVerify] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    setLoading(true);
    const userData = {name:name, email,mobile,password};
    if (nameVerify && emailVerify && passwordVerify && mobileVerify){
     axios
      .post(`${BASE_URL}/register`,userData)
      .then(res => {
        console.log(res.data);
        if(res.data.status == "ok"){
        Alert.alert("Registeration Successfull");
      }else{
        Alert.alert(JSON.stringify(res.data));
      }
    })
      .catch(e => console.log(e))
    setTimeout(() => {
      setLoading(false);
      router.push('/login'); // Navigate to login after successful registration
    }, 2000)
    }
    else{
      Alert.alert("Fill all details")
    }
  
  };
  const handleName = (text) => {
    setName(text);
    if (text.length > 1) {
      setNameVerify(true); // Valid name
    } else {
      setNameVerify(false); // Invalid name
    }
  };

  const handleEmail = (text) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailVerify(emailRegex.test(text));
  }
  
  const handlePassword = (text) => {
    setPassword(text);
    if (text.length >= 6) {
      setPasswordVerify(true);
    } else {
      setPasswordVerify(false);
    }

  }
  const handleMobile = (text) => {
    setMobile(text);
    const mobileRegex = /^[0-9]{10}$/;
    if (mobileRegex.test(text)) {
      setMobileVerify(true);
    } else {
      setMobileVerify(false);
    }
  };

  return (
    <KeyboardAvoidingView 
    style={{ flex: 1 }} 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjusts behavior for iOS/Android
    keyboardVerticalOffset={50} // Adjust this as needed
  >
    <ScrollView className="flex-auto" contentContainerStyle = {{flexGrow:1}} keyboardShouldPersistTaps="handled">
    <View className="h-full w-full top-40 items-center pb-20">
      <Image
        source={require("./icons/add-user.png")}
        className = "w-20 h-20"
        resizeMode="contain" 
      />

      {/* Register Title */}
      <View className="flex items-center">
        <Text className="text-blue-950 font-bold tracking-wider text-3xl mt-3 mb-8">SIGN UP</Text>
      </View>

      <View className="flex items-center mx-4 space-y-4">
        {/* Name Input */}
        <View className="flex-row bg-black/5 p-5 rounded-md w-full">
          <TextInput 
            className = "flex-1"
            placeholder="Name"
            value={name} 
            onChangeText = {handleName}
            placeholderTextColor="#9CA3AF"
          />
             {name.length < 1 ? null :nameVerify ? (
            <Feather 
                name="check-circle" 
                size={20} 
                color="green" />
            ) : (
            <Feather 
                name="x-circle" 
                size={20} 
                color="red" />
            )}
        </View>
          {name.length < 1 ? null: nameVerify ? null:  (
          <Text className="text-red-500 text-xs mt-1">Name should be longer than 1 character.</Text>
            )}

        {/* Email Input */}
        <View className="flex-row bg-black/5 p-5 rounded-md w-full">
          <TextInput 
            className = "flex-1"
            placeholder="Email"
            value={email}
            onChangeText={handleEmail}
            placeholderTextColor="#9CA3AF"
          />
          {email.length < 1 ? null :emailVerify ? (
            <Feather 
                name="check-circle" 
                size={20} 
                color="green" />
            ) : (
            <Feather 
                name="x-circle" 
                size={20} 
                color="red" />
            )}
        </View>
        {email.length < 1 ? null : emailVerify ? null : (
        <Text className="text-red-500 text-xs mt-1">Please enter a valid email address.</Text>
      )}

        {/* Mobile Input */}
        <View className="flex-row bg-black/5 p-5 rounded-md w-full mb-1">
          <TextInput 
            className = "flex-1"
            placeholder="Mobile"
            value={mobile}
            onChangeText={handleMobile}
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
          
          {mobile.length < 1 ? null : mobileVerify ? (
          <Feather name="check-circle" size={20} color="green" />
        ) : (
          <Feather name="x-circle" size={20} color="red" />
        )}
      </View>
      {mobile.length < 1 ? null : mobileVerify ? null : (
        <Text className="text-red-500 text-xs mt-1">Mobile number must be 10 digits.</Text>
        )}
        
        {/* Password Input */}
        <View className="flex-row bg-black/5 p-5 rounded-md w-full">
          <TextInput 
            className = "flex-1"
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={handlePassword}
            placeholderTextColor="#9CA3AF"
          />
         {password.length < 1 ? null : passwordVerify ? (
          <Feather name="check-circle" size={20} color="green" />
        ) : (
          <Feather name="x-circle" size={20} color="red" />
        )}
      </View>
      {password.length < 1 ? null : passwordVerify ? null : (
        <Text className="text-red-500 text-xs mt-1">Password should be at least 6 characters.</Text>
      )}

        
        {/* Register Button */}
        <View className="w-full items-center">
          <TouchableOpacity 
            className="w-40 bg-blue-950 p-3 rounded-md mt-5 mb-3"
            onPress={handleRegister}
            disabled={loading}
          >
            <Text className="text-xl font-bold text-white text-center">
              {loading ? 'Registering...' : 'REGISTER'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Already have an account? Link */}
        <View className="flex-row justify-center">
          <TouchableOpacity onPress={() => router.push('/login')}>
            <Text className="text-bold text-blue-950">Already have an account? <Text className='underline'>LOG IN</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
    </View></ScrollView></KeyboardAvoidingView>
  );
}
