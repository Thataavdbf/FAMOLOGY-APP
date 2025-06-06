import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppContext } from '../services/AppContext';
import { TreeNode, NewRelativeData } from '../types';
import { generateUniqueId } from '../utils/numerology';

type AddFamilyMemberScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AddFamilyMember'>;
type AddFamilyMemberScreenRouteProp = RouteProp<RootStackParamList, 'AddFamilyMember'>;

const AddFamilyMemberScreen = () => {
  const navigation = useNavigation<AddFamilyMemberScreenNavigationProp>();
  const route = useRoute<AddFamilyMemberScreenRouteProp>();
  const { treeNodes, addFamilyMember, isLoading } = useAppContext();
  
  const { relativeType, selectedNodeId } = route.params;
  const selectedNode = treeNodes.find(node => node.id === selectedNodeId);
  
  // Form state
  const [name, setName] = React.useState('');
  const [birthdate, setBirthdate] = React.useState(new Date());
  const [birthplace, setBirthplace] = React.useState('');
  const [birthtime, setBirthtime] = React.useState(new Date());
  
  // Date/time picker state
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [showTimePicker, setShowTimePicker] = React.useState(false);
  
  // Get relationship label
  const getRelationshipLabel = () => {
    const labels: {[key: string]: string} = {
      'child': 'Child',
      'parent': 'Parent',
      'sibling': 'Sibling',
      'partner': 'Partner'
    };
    return labels[relativeType] || 'Relative';
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    if (!name || !selectedNode) {
      alert('Please enter a name');
      return;
    }
    
    // Format data
    const newRelativeData: NewRelativeData = {
      name,
      birthdate: format(birthdate, 'yyyy-MM-dd'),
      birthplace: birthplace || undefined,
      birthtime: birthtime ? format(birthtime, 'HH:mm') : undefined,
    };
    
    // Create new tree node
    const newNodeId = generateUniqueId();
    const newNode: TreeNode = {
      id: newNodeId,
      name: newRelativeData.name,
      birthdate: newRelativeData.birthdate,
      birthplace: newRelativeData.birthplace || 'Unknown',
      birthtime: newRelativeData.birthtime || 'Unknown',
      type: relativeType,
      children: [],
      parents: [],
      siblings: [],
      partners: []
    };
    
    // Update relationships based on type
    switch (relativeType) {
      case 'child':
        newNode.parents.push(selectedNode.id);
        break;
      case 'parent':
        newNode.children.push(selectedNode.id);
        break;
      case 'sibling':
        newNode.siblings.push(selectedNode.id);
        break;
      case 'partner':
        newNode.partners.push(selectedNode.id);
        break;
    }
    
    // Save new family member
    await addFamilyMember(newNode);
    navigation.goBack();
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
  
  if (!selectedNode) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Selected family member not found.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Add {getRelationshipLabel()}</Text>
        <Text style={styles.subtitle}>
          Adding a {getRelationshipLabel().toLowerCase()} for {selectedNode.name}
        </Text>
        
        <View style={styles.formGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter name"
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
          <Text style={styles.label}>Birthplace <Text style={styles.optional}>(optional)</Text></Text>
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
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={() => navigation.goBack()}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.saveButton} 
            onPress={handleSubmit}
            disabled={isLoading || !name}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    marginBottom: 24,
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#111827',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddFamilyMemberScreen;
