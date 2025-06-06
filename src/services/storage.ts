import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserInfo, TreeNode } from '../types';

// Default user data as requested
const DEFAULT_USER: UserInfo = {
  id: 1,
  name: "Tyler Jerome Daniels",
  birthdate: "1988-06-02",
  birthplace: "Des Moines, Iowa",
  birthtime: "00:41",
  createdAt: new Date().toISOString()
};

// Storage keys
const STORAGE_KEYS = {
  USER_INFO: 'famology_user_info',
  TREE_NODES: 'famology_tree_nodes',
};

/**
 * Initialize storage with default data if not already set
 */
export const initializeStorage = async (): Promise<void> => {
  try {
    // Check if user info exists
    const userInfo = await AsyncStorage.getItem(STORAGE_KEYS.USER_INFO);
    
    if (!userInfo) {
      // Save default user
      await AsyncStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(DEFAULT_USER));
      
      // Create initial tree node for default user
      const rootNode: TreeNode = {
        id: DEFAULT_USER.id || 1,
        name: DEFAULT_USER.name,
        birthdate: DEFAULT_USER.birthdate,
        birthplace: DEFAULT_USER.birthplace || 'Unknown',
        birthtime: DEFAULT_USER.birthtime || 'Unknown',
        type: 'self',
        children: [],
        parents: [],
        siblings: [],
        partners: []
      };
      
      await AsyncStorage.setItem(STORAGE_KEYS.TREE_NODES, JSON.stringify([rootNode]));
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

/**
 * Get user information
 */
export const getUserInfo = async (): Promise<UserInfo | null> => {
  try {
    const userInfo = await AsyncStorage.getItem(STORAGE_KEYS.USER_INFO);
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Error getting user info:', error);
    return null;
  }
};

/**
 * Save user information
 */
export const saveUserInfo = async (userInfo: UserInfo): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
    return true;
  } catch (error) {
    console.error('Error saving user info:', error);
    return false;
  }
};

/**
 * Get all tree nodes
 */
export const getTreeNodes = async (): Promise<TreeNode[]> => {
  try {
    const treeNodes = await AsyncStorage.getItem(STORAGE_KEYS.TREE_NODES);
    return treeNodes ? JSON.parse(treeNodes) : [];
  } catch (error) {
    console.error('Error getting tree nodes:', error);
    return [];
  }
};

/**
 * Save all tree nodes
 */
export const saveTreeNodes = async (treeNodes: TreeNode[]): Promise<boolean> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TREE_NODES, JSON.stringify(treeNodes));
    return true;
  } catch (error) {
    console.error('Error saving tree nodes:', error);
    return false;
  }
};

/**
 * Add a new tree node
 */
export const addTreeNode = async (newNode: TreeNode): Promise<boolean> => {
  try {
    const treeNodes = await getTreeNodes();
    treeNodes.push(newNode);
    return await saveTreeNodes(treeNodes);
  } catch (error) {
    console.error('Error adding tree node:', error);
    return false;
  }
};

/**
 * Update an existing tree node
 */
export const updateTreeNode = async (updatedNode: TreeNode): Promise<boolean> => {
  try {
    const treeNodes = await getTreeNodes();
    const index = treeNodes.findIndex(node => node.id === updatedNode.id);
    
    if (index !== -1) {
      treeNodes[index] = updatedNode;
      return await saveTreeNodes(treeNodes);
    }
    
    return false;
  } catch (error) {
    console.error('Error updating tree node:', error);
    return false;
  }
};

/**
 * Clear all storage (for testing/reset)
 */
export const clearStorage = async (): Promise<boolean> => {
  try {
    await AsyncStorage.multiRemove([STORAGE_KEYS.USER_INFO, STORAGE_KEYS.TREE_NODES]);
    return true;
  } catch (error) {
    console.error('Error clearing storage:', error);
    return false;
  }
};
