import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppContext } from '../services/AppContext';
import { TreeNode } from '../types';
import { formatDate } from '../utils/numerology';

type FamilyMemberDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FamilyMemberDetail'>;
type FamilyMemberDetailScreenRouteProp = RouteProp<RootStackParamList, 'FamilyMemberDetail'>;

const FamilyMemberDetailScreen = () => {
  const navigation = useNavigation<FamilyMemberDetailScreenNavigationProp>();
  const route = useRoute<FamilyMemberDetailScreenRouteProp>();
  const { treeNodes } = useAppContext();
  
  const { nodeId } = route.params;
  const member = treeNodes.find(node => node.id === nodeId);
  
  if (!member) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Family member not found.</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  // Find related family members
  const getRelatedMembers = (relationshipType: 'children' | 'parents' | 'siblings' | 'partners') => {
    return member[relationshipType].map(id => 
      treeNodes.find(node => node.id === id)
    ).filter(Boolean) as TreeNode[];
  };
  
  // Navigate to add family member screen
  const handleAddRelative = (relativeType: string) => {
    navigation.navigate('AddFamilyMember', {
      relativeType,
      selectedNodeId: member.id
    });
  };
  
  // Navigate to family member detail screen
  const handleViewMemberDetails = (nodeId: string | number) => {
    navigation.navigate('FamilyMemberDetail', { nodeId });
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{member.name}</Text>
        <Text style={styles.relationshipType}>{member.type === 'self' ? 'You' : member.type}</Text>
      </View>
      
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="person" size={20} color="#8b5cf6" />
          <Text style={styles.cardTitle}>Personal Information</Text>
        </View>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Date of Birth</Text>
          <Text style={styles.infoValue}>{formatDate(member.birthdate)}</Text>
        </View>
        
        {member.birthplace && member.birthplace !== 'Unknown' && (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Birthplace</Text>
            <Text style={styles.infoValue}>{member.birthplace}</Text>
          </View>
        )}
        
        {member.birthtime && member.birthtime !== 'Unknown' && (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Time of Birth</Text>
            <Text style={styles.infoValue}>{member.birthtime}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="people" size={20} color="#8b5cf6" />
          <Text style={styles.cardTitle}>Relationships</Text>
        </View>
        
        <View style={styles.relationshipButtons}>
          <TouchableOpacity
            style={styles.relationshipButton}
            onPress={() => handleAddRelative('child')}
          >
            <Ionicons name="add-circle-outline" size={16} color="#fff" />
            <Text style={styles.relationshipButtonText}>Add Child</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.relationshipButton}
            onPress={() => handleAddRelative('parent')}
          >
            <Ionicons name="add-circle-outline" size={16} color="#fff" />
            <Text style={styles.relationshipButtonText}>Add Parent</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.relationshipButton}
            onPress={() => handleAddRelative('sibling')}
          >
            <Ionicons name="add-circle-outline" size={16} color="#fff" />
            <Text style={styles.relationshipButtonText}>Add Sibling</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.relationshipButton}
            onPress={() => handleAddRelative('partner')}
          >
            <Ionicons name="add-circle-outline" size={16} color="#fff" />
            <Text style={styles.relationshipButtonText}>Add Partner</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Display related people */}
      {['children', 'parents', 'siblings', 'partners'].map(relationType => {
        const relatedMembers = getRelatedMembers(relationType as any);
        if (relatedMembers.length === 0) return null;
        
        return (
          <View key={relationType} style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons 
                name={
                  relationType === 'children' ? 'people-outline' :
                  relationType === 'parents' ? 'person-outline' :
                  relationType === 'siblings' ? 'people-outline' :
                  'heart-outline'
                } 
                size={20} 
                color="#8b5cf6" 
              />
              <Text style={styles.cardTitle}>
                {relationType.charAt(0).toUpperCase() + relationType.slice(1)}
              </Text>
            </View>
            
            {relatedMembers.map(relative => (
              <TouchableOpacity
                key={relative.id.toString()}
                style={styles.relatedMemberItem}
                onPress={() => handleViewMemberDetails(relative.id)}
              >
                <Text style={styles.relatedMemberName}>{relative.name}</Text>
                <View style={styles.relatedMemberInfo}>
                  <Text style={styles.relatedMemberDate}>
                    {new Date(relative.birthdate).getFullYear()}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#8b5cf6" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  relationshipType: {
    fontSize: 16,
    color: '#8b5cf6',
    textTransform: 'capitalize',
  },
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 8,
  },
  infoItem: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#fff',
  },
  relationshipButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  relationshipButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    width: '48%',
  },
  relationshipButtonText: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  relatedMemberItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  relatedMemberName: {
    color: '#fff',
    fontSize: 16,
  },
  relatedMemberInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  relatedMemberDate: {
    color: '#9ca3af',
    fontSize: 14,
    marginRight: 8,
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

export default FamilyMemberDetailScreen;
