export interface RsvpData {
  id?: string;
  organization: string;
  name: string;
  phone: string;
  consent: boolean;
  createdAt: any; // Can be Timestamp or Date
}

export interface AdminUser {
  uid: string;
  email: string;
  createdAt: any;
}

export interface HistoryEvent {
  year: string;
  title: string;
  description: string;
  imageAlt: string;
  gradient: string;
  emoji: string;
  details: string[];
}
