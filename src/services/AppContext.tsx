import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { UserInfo, TreeNode } from '../types';
import * as StorageService from '../services/storage';

interface AppContextProps {
  userInfo: UserInfo | null;
  treeNodes: TreeNode[];
  isLoading: boolean;
  error: string | null;
  updateUserInfo: (userInfo: UserInfo) => Promise<void>;
  addFamilyMember: (newNode: TreeNode) => Promise<void>;
  updateFamilyMember: (updatedNode: TreeNode) => Promise<void>;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize data on app start
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Initialize storage with default data if needed
        await StorageService.initializeStorage();
        
        // Load user info and tree nodes
        await refreshData();
      } catch (err) {
        console.error('Error initializing app:', err);
        setError('Failed to initialize app data');
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Refresh all data from storage
  const refreshData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const userData = await StorageService.getUserInfo();
      setUserInfo(userData);
      
      const nodes = await StorageService.getTreeNodes();
      setTreeNodes(nodes);
    } catch (err) {
      console.error('Error refreshing data:', err);
      setError('Failed to load app data');
    } finally {
      setIsLoading(false);
    }
  };

  // Update user information
  const updateUserInfo = async (updatedUserInfo: UserInfo) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const success = await StorageService.saveUserInfo(updatedUserInfo);
      
      if (success) {
        setUserInfo(updatedUserInfo);
        
        // Update root node in tree if it exists
        if (treeNodes.length > 0) {
          const rootNodeIndex = treeNodes.findIndex(node => node.type === 'self');
          
          if (rootNodeIndex !== -1) {
            const updatedNodes = [...treeNodes];
            updatedNodes[rootNodeIndex] = {
              ...updatedNodes[rootNodeIndex],
              name: updatedUserInfo.name,
              birthdate: updatedUserInfo.birthdate,
              birthplace: updatedUserInfo.birthplace || 'Unknown',
              birthtime: updatedUserInfo.birthtime || 'Unknown'
            };
            
            await StorageService.saveTreeNodes(updatedNodes);
            setTreeNodes(updatedNodes);
          }
        }
      } else {
        setError('Failed to update user information');
      }
    } catch (err) {
      console.error('Error updating user info:', err);
      setError('Failed to update user information');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new family member
  const addFamilyMember = async (newNode: TreeNode) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Add the new node
      const success = await StorageService.addTreeNode(newNode);
      
      if (success) {
        // Update the related node's relationships
        const updatedNodes = [...treeNodes];
        
        // Find nodes that need relationship updates
        newNode.parents.forEach(parentId => {
          const parentIndex = updatedNodes.findIndex(node => node.id === parentId);
          if (parentIndex !== -1) {
            updatedNodes[parentIndex].children.push(newNode.id);
          }
        });
        
        newNode.children.forEach(childId => {
          const childIndex = updatedNodes.findIndex(node => node.id === childId);
          if (childIndex !== -1) {
            updatedNodes[childIndex].parents.push(newNode.id);
          }
        });
        
        newNode.siblings.forEach(siblingId => {
          const siblingIndex = updatedNodes.findIndex(node => node.id === siblingId);
          if (siblingIndex !== -1) {
            updatedNodes[siblingIndex].siblings.push(newNode.id);
          }
        });
        
        newNode.partners.forEach(partnerId => {
          const partnerIndex = updatedNodes.findIndex(node => node.id === partnerId);
          if (partnerIndex !== -1) {
            updatedNodes[partnerIndex].partners.push(newNode.id);
          }
        });
        
        // Save updated nodes and refresh state
        await StorageService.saveTreeNodes([...updatedNodes, newNode]);
        setTreeNodes([...updatedNodes, newNode]);
      } else {
        setError('Failed to add family member');
      }
    } catch (err) {
      console.error('Error adding family member:', err);
      setError('Failed to add family member');
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing family member
  const updateFamilyMember = async (updatedNode: TreeNode) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const success = await StorageService.updateTreeNode(updatedNode);
      
      if (success) {
        const updatedNodes = treeNodes.map(node => 
          node.id === updatedNode.id ? updatedNode : node
        );
        
        setTreeNodes(updatedNodes);
      } else {
        setError('Failed to update family member');
      }
    } catch (err) {
      console.error('Error updating family member:', err);
      setError('Failed to update family member');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        userInfo,
        treeNodes,
        isLoading,
        error,
        updateUserInfo,
        addFamilyMember,
        updateFamilyMember,
        refreshData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  
  return context;
};
