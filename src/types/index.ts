export interface UserInfo {
  id?: number;
  name: string;
  birthdate: string;
  birthplace?: string;
  birthtime?: string;
  createdAt?: string;
}

export interface TreeNode {
  id: string | number;
  name: string;
  birthdate: string;
  birthplace?: string;
  birthtime?: string;
  type: 'self' | 'parent' | 'child' | 'sibling' | 'partner';
  children: (string | number)[];
  parents: (string | number)[];
  siblings: (string | number)[];
  partners: (string | number)[];
}

export interface RelationshipType {
  id: string | number;
  fromMemberId: string | number;
  toMemberId: string | number;
  relationshipType: 'parent' | 'child' | 'sibling' | 'partner';
}

export interface NewRelativeData {
  name: string;
  birthdate: string;
  birthplace?: string;
  birthtime?: string;
}
