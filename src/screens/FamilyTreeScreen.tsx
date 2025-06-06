import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAppContext } from '../services/AppContext';
import { TreeNode } from '../types';

type FamilyTreeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const FamilyTreeScreen = () => {
  const navigation = useNavigation<FamilyTreeScreenNavigationProp>();
  const { treeNodes, isLoading, error } = useAppContext();
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);

  // Select first node (self) by default when data loads
  useEffect(() => {
    if (treeNodes.length > 0 && !selectedNode) {
      const selfNode = treeNodes.find(node => node.type === 'self');
      if (selfNode) {
        setSelectedNode(selfNode);
      }
    }
  }, [treeNodes, selectedNode]);

  // Handle node selection
  const handleNodeSelect = (node: TreeNode) => {
    setSelectedNode(node);
  };

  // Navigate to add family member screen
  const handleAddRelative = (relativeType: string) => {
    if (selectedNode) {
      navigation.navigate('AddFamilyMember', {
        relativeType,
        selectedNodeId: selectedNode.id
      });
    }
  };

  // Navigate to family member detail screen
  const handleViewMemberDetails = (nodeId: string | number) => {
    navigation.navigate('FamilyMemberDetail', { nodeId });
  };

  // Find related family members
  const getRelatedMembers = (relationshipType: 'children' | 'parents' | 'siblings' | 'partners') => {
    if (!selectedNode) return [];
    
    return selectedNode[relationshipType].map(id => 
      treeNodes.find(node => node.id === id)
    ).filter(Boolean) as TreeNode[];
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8b5cf6" />
        <Text style={styles.loadingText}>Loading family tree...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Onboarding')}>
          <Text style={styles.buttonText}>Return to Onboarding</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (treeNodes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No family tree data available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Tree Visualization */}
      <ScrollView style={styles.treeContainer}>
        <Text style={styles.sectionTitle}>Family Members</Text>
        <View style={styles.treeVisualization}>
          {treeNodes.map(node => (
            <TouchableOpacity
              key={node.id.toString()}
              style={[
                styles.treeNode,
                selectedNode?.id === node.id && styles.selectedNode
              ]}
              onPress={() => handleNodeSelect(node)}
            >
              <Text style={styles.nodeName}>{node.name}</Text>
              <Text style={styles.nodeInfo}>
                {new Date(node.birthdate).toLocaleDateString()}
              </Text>
              {node.birthplace && (
                <Text style={styles.nodeInfo}>{node.birthplace}</Text>
              )}
              
              {/* Display relationships count */}
              <View style={styles.relationshipsContainer}>
                {node.children.length > 0 && (
                  <View style={styles.relationshipBadge}>
                    <Ionicons name="people-outline" size={14} color="#fff" />
                    <Text style={styles.relationshipCount}>{node.children.length}</Text>
                  </View>
                )}
                {node.parents.length > 0 && (
                  <View style={styles.relationshipBadge}>
                    <Ionicons name="person-outline" size={14} color="#fff" />
                    <Text style={styles.relationshipCount}>{node.parents.length}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Details Panel */}
      <View style={styles.detailsPanel}>
        {selectedNode ? (
          <>
            <Text style={styles.detailsTitle}>{selectedNode.name}</Text>
            
            <View style={styles.detailsSection}>
              <Text style={styles.detailsSectionTitle}>Personal Details</Text>
              <Text style={styles.detailsLabel}>Birthdate:</Text>
              <Text style={styles.detailsValue}>
                {new Date(selectedNode.birthdate).toLocaleDateString()}
              </Text>
              
              {selectedNode.birthplace && (
                <>
                  <Text style={styles.detailsLabel}>Birthplace:</Text>
                  <Text style={styles.detailsValue}>{selectedNode.birthplace}</Text>
                </>
              )}
              
              {selectedNode.birthtime && (
                <>
                  <Text style={styles.detailsLabel}>Birth Time:</Text>
                  <Text style={styles.detailsValue}>{selectedNode.birthtime}</Text>
                </>
              )}
            </View>
            
            <View style={styles.detailsSection}>
              <Text style={styles.detailsSectionTitle}>Relationships</Text>
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
                <View key={relationType} style={styles.detailsSection}>
                  <Text style={styles.detailsSectionTitle}>
                    {relationType.charAt(0).toUpperCase() + relationType.slice(1)}
                  </Text>
                  {relatedMembers.map(member => (
                    <TouchableOpacity
                      key={member.id.toString()}
                      style={styles.relatedMemberItem}
                      onPress={() => handleViewMemberDetails(member.id)}
                    >
                      <Text style={styles.relatedMemberName}>{member.name}</Text>
                      <Ionicons name="chevron-forward" size={16} color="#8b5cf6" />
                    </TouchableOpacity>
                  ))}
                </View>
              );
            })}
          </>
        ) : (
          <View style={styles.noSelectionContainer}>
            <Text style={styles.noSelectionText}>
              Select a family member to view details
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
    padding: 20,
  },
  errorText: {
    color: '#ef4444',
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 16,
  },
  treeContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  treeVisualization: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  treeNode: {
    backgroundColor: '#1f2937',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    width: '48%',
    borderWidth: 1,
    borderColor: '#374151',
  },
  selectedNode: {
    borderColor: '#8b5cf6',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  nodeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  nodeInfo: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 2,
  },
  relationshipsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  relationshipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 6,
  },
  relationshipCount: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 4,
  },
  detailsPanel: {
    backgroundColor: '#1f2937',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    maxHeight: '50%',
  },
  detailsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  detailsSection: {
    marginBottom: 16,
  },
  detailsSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  detailsLabel: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 2,
  },
  detailsValue: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 8,
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
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  relatedMemberName: {
    color: '#fff',
    fontSize: 14,
  },
  noSelectionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  noSelectionText: {
    color: '#9ca3af',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#8b5cf6',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FamilyTreeScreen;
