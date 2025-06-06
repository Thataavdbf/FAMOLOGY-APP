import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppContext } from '../services/AppContext';
import { UserInfo } from '../types';

type OnboardingScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

const OnboardingScreen = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  const { updateUserInfo } = useAppContext();
  
  // Form state
  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState(new Date());
  const [birthplace, setBirthplace] = useState('');
  const [birthtime, setBirthtime] = useState(new Date());
  
  // Date/time picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!name) {
      alert('Please enter your name');
      return;
    }
    
    // Format data for storage
    const userInfo: UserInfo = {
      name,
      birthdate: format(birthdate, 'yyyy-MM-dd'),
      birthplace: birthplace || undefined,
      birthtime: birthtime ? format(birthtime, 'HH:mm') : undefined,
    };
    
    // Save user info and navigate to main app
    await updateUserInfo(userInfo);
    navigation.navigate('Main');
  };
  
  // Handle date change
  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || birthdate;
    setShowDatePicker(Platform.OS === 'ios');
    setBirthdate(currentDate);
  };
  
  // Handle time change
  const onTimeChange = (event: any, selectedTime?: Date) => {
    const currentTime = selectedTime || birthtime;
    setShowTimePicker(Platform.OS === 'ios');
    setBirthtime(currentTime);
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Famology</Text>
        <Text style={styles.subtitle}>Let's get started with your information</Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Your Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor="#6b7280"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Date of Birth</Text>
          <TouchableOpacity 
            style={styles.input} 
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateText}>
              {format(birthdate, 'MMMM d, yyyy')}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={birthdate}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Birthplace (City, State) <Text style={styles.optional}>(optional)</Text></Text>
          <TextInput
            style={styles.input}
            value={birthplace}
            onChangeText={setBirthplace}
            placeholder="e.g. Chicago, IL"
            placeholderTextColor="#6b7280"
          />
        </View>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Time of Birth <Text style={styles.optional}>(optional)</Text></Text>
          <TouchableOpacity 
            style={styles.input} 
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.dateText}>
              {format(birthtime, 'h:mm a')}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={birthtime}
              mode="time"
              display="default"
              onChange={onTimeChange}
            />
          )}
        </View>
        
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Start Exploring</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 30,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  optional: {
    fontSize: 12,
    color: '#9ca3af',
  },
  input: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#4b5563',
    borderRadius: 8,
    padding: 15,
    color: '#fff',
    fontSize: 16,
  },
  dateText: {
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default OnboardingScreen;
