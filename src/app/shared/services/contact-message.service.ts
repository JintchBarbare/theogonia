import { Injectable, signal } from '@angular/core';
import { ContactMessage, ContactMessageDraft } from '../models/contact-message.model';

const STORAGE_KEY = 'theogony_contact_messages';

@Injectable({ providedIn: 'root' })
export class ContactMessageService {
  private readonly _messages = signal<ContactMessage[]>(this.load());
  readonly messages = this._messages.asReadonly();

  send(draft: ContactMessageDraft): void {
    const entry: ContactMessage = {
      ...draft,
      id: crypto.randomUUID(),
      sentAt: new Date().toISOString()
    };
    this._messages.update(list => [entry, ...list]);
    this.save();
  }

  private load(): ContactMessage[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as ContactMessage[]) : [];
    } catch {
      return [];
    }
  }

  private save(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._messages()));
    } catch {
      // storage unavailable, ignore
    }
  }
}