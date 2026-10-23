export type EmailCategory =
  | 'Job and Career'
  | 'Business and Corporate'
  | 'Education'
  | 'Customer Service'
  | 'Sales and Marketing'
  | 'Personal and Everyday'
  | 'Legal, Finance, and Administration';

export type EmailTone =
  | 'Professional'
  | 'Formal'
  | 'Friendly'
  | 'Polite'
  | 'Persuasive'
  | 'Confident'
  | 'Diplomatic'
  | 'Apologetic'
  | 'Empathetic'
  | 'Assertive'
  | 'Academic'
  | 'Executive'
  | 'Casual'
  | 'Sales-oriented'
  | 'Customer-support-oriented';

export type EmailLength = 'Short' | 'Medium' | 'Detailed';

export type EmailStatus = 'draft' | 'saved' | 'sent' | 'archived';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  emailSignature?: string;
  isEmailVerified: boolean;
  settings: {
    defaultTone: string;
    defaultLength: string;
    theme: 'light' | 'dark' | 'system';
    emailNotifications: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Email {
  _id: string;
  user: string;
  title: string;
  subject: string;
  body: string;
  recipientName?: string;
  recipientEmail?: string;
  senderName?: string;
  category: EmailCategory | string;
  purpose?: string;
  tone: EmailTone | string;
  length: EmailLength;
  language: string;
  callToAction?: string;
  referenceText?: string;
  status: EmailStatus;
  isFavorite: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  deletedAt?: string;
  templateId?: string;
  versionCount: number;
  deliveryStatus?: 'not_sent' | 'queued' | 'sent' | 'delivered' | 'failed';
  deliveryError?: string;
  lastSentAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailVersion {
  _id: string;
  emailId: string;
  versionNumber: number;
  subject: string;
  body: string;
  changeDescription?: string;
  savedBy: string;
  createdAt: string;
}

export interface Template {
  _id: string;
  title: string;
  category: EmailCategory | string;
  description: string;
  subject: string;
  body: string;
  defaultTone: string;
  defaultLength: EmailLength;
  isSystem: boolean;
  owner?: string;
  usageCount: number;
  placeholders: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AnalyticsData {
  overview: {
    totalEmails: number;
    draftsCount: number;
    sentCount: number;
    favoritesCount: number;
  };
  categories: {
    category: string;
    count: number;
  }[];
  weeklyActivity: {
    date: string;
    day: string;
    count: number;
  }[];
  recentlyEdited: {
    _id: string;
    title: string;
    subject: string;
    category: string;
    status: string;
    updatedAt: string;
    isFavorite: boolean;
  }[];
  recentActivity: {
    _id: string;
    action: string;
    status: 'success' | 'failure';
    details?: any;
    createdAt: string;
  }[];
}
