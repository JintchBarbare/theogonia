export interface ContactMessage {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  sentAt: string;
}

export type ContactMessageDraft = Omit<ContactMessage, 'id' | 'sentAt'>;