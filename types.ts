// types.ts
export type RootStackParamList = {
    index: undefined; // Define params for 'index' screen if any
    home: undefined;
    HubHome:undefined;  // Define params for 'home' screen if any
    // Add other screens and their params here
  };

  // types.ts
export interface Hub {
  _id: string;
  name: string;
  description?: string;
  avatar_url?: string;
  banner_url?: string;
  owner_id: string;
  demonym?: string;
}

export interface HubsProps {
  userId: string;
  setmainhubs:(hubs:Hub[])=>void
  //setPrincipalHubs: (hubs: Hub[]) => void;
}

export interface Member {
  _id: string;
  username: string;
  avatar_url?: string;
  bio?:string;
  created_at:string;
}

export interface Chat {
  _id: string;
  members: Member[]; // Array of Member objects
  created_at: Date;
  updated_at: Date;
}

export interface Qube {
  _id:string;
  hub_id?: string;
  name?: string;
  nickname?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface Message {
  _id:string;
  text?: string;
  voice?: string;
  senderAvatar?: string;
  senderName?: string;
  name_file?: string;
  file?: string;
  folder?: {
    file_name: string;
    file_url: string;
  }[];
  name_folder?: string;
  sender_id: any;
  zone_id: string;
  qube_id?: string;
  tags?: string;
  createdAt?: Date;
  updatedAt?: Date;
  uuid?:string;
  color?:string;
}

export interface Zone {
  _id:string;
  qube_id: string;
  name: string;
  created_at?: Date;
  updated_at?: Date;
}

