export type UserRole = 'entrepreneur' | 'investor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  bio: string;
  isOnline?: boolean;
  createdAt: string;
}

export interface Entrepreneur extends User {
  role: 'entrepreneur';
  startupName: string;
  pitchSummary: string;
  fundingNeeded: string;
  industry: string;
  location: string;
  foundedYear: number;
  teamSize: number;
}

export interface Investor extends User {
  role: 'investor';
  investmentInterests: string[];
  investmentStage: string[];
  portfolioCompanies: string[];
  totalInvestments: number;
  minimumInvestment: string;
  maximumInvestment: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
}

export interface ChatConversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  updatedAt: string;
}

export interface CollaborationRequest {
  id: string;
  investorId: string;
  entrepreneurId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  shared: boolean;
  url: string;
  ownerId: string;
}

export interface AvailabilitySlot {
  id: string;
  userId: string;
  date: string;
  startTime: string;
  endTime: string;
  label: string;
  mode: 'Video' | 'Phone' | 'In person';
}

export interface MeetingRequest {
  id: string;
  requesterId: string;
  recipientId: string;
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'accepted' | 'declined';
  note: string;
}

export interface ChamberDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  lastModified: string;
  shared: boolean;
  url?: string;
  ownerId: string;
  dealName: string;
  status: 'Draft' | 'In Review' | 'Signed';
  signer?: string;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'Deposit' | 'Withdraw' | 'Transfer' | 'Deal Funding';
  amount: number;
  sender: string;
  receiver: string;
  status: 'Completed' | 'Pending' | 'Failed';
}

export interface FundingDeal {
  id: string;
  investorId: string;
  entrepreneurId: string;
  startupName: string;
  amount: number;
  status: 'Ready' | 'Processing' | 'Funded';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (userId: string, updates: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}
