import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContactMessageService } from '../../shared/services/contact-message.service';

type ContactField = 'firstName' | 'lastName' | 'phone' | 'email' | 'subject' | 'message';

interface TextField {
  name: ContactField;
  label: string;
  type: 'text' | 'tel' | 'email';
  placeholder: string;
}

const MESSAGE_MAX_LENGTH = 1000;
const SUCCESS_TEXT = 'Message sent! A keeper of the archive will reply soon.';

const ERROR_MESSAGES: Record<ContactField, Record<string, string>> = {
  firstName: {
    required: 'First name is required',
    minlength: 'At least 2 characters required'
  },
  lastName: {
    required: 'Last name is required',
    minlength: 'At least 2 characters required'
  },
  phone: {
    required: 'Phone number is required',
    pattern: 'Enter a valid phone number (e.g. +30 21 0000 0000)'
  },
  email: {
    required: 'Email address is required',
    email: 'Enter a valid email address'
  },
  subject: { required: 'Choose a subject' },
  message: {
    required: 'Message is required',
    maxlength: `Maximum ${MESSAGE_MAX_LENGTH} characters`
  }
};

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  templateUrl: './contact.html',
  styleUrl: './contact.css'
})
export class Contact {
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(ContactMessageService);

  protected readonly maxMessageLength = MESSAGE_MAX_LENGTH;

  protected readonly contactInfo = [
    { icon: '✉', title: 'keepers@theogonia.org', note: 'For press and long letters' },
    { icon: '◷', title: 'Replies within three days', note: 'Monday to Friday, Athens time' }
  ];

  protected readonly textFields: TextField[] = [
    { name: 'firstName', label: 'First name', type: 'text', placeholder: 'Penelope' },
    { name: 'lastName', label: 'Last name', type: 'text', placeholder: 'of Ithaca' },
    { name: 'phone', label: 'Phone number', type: 'tel', placeholder: '+30 21 0000 0000' },
    { name: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com' }
  ];

  protected readonly subjects = [
    'Myth correction',
    'Missing figure / nymph',
    'Collaboration',
    'General inquiry'
  ];

  protected readonly submittedAttempt = signal(false);
  protected readonly successMessage = signal<string | null>(null);

  protected readonly contactForm = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s-]{6,20}$/)]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required]],
    message: ['', [Validators.required, Validators.maxLength(MESSAGE_MAX_LENGTH)]]
  });

  protected get messageLength(): number {
    return this.contactForm.controls.message.value.length;
  }

  protected get showErrorAlert(): boolean {
    return this.submittedAttempt() && this.contactForm.invalid;
  }

  protected hasError(field: ContactField): boolean {
    const control = this.contactForm.controls[field];
    return control.touched && control.invalid;
  }

  protected errorMessage(field: ContactField): string | null {
    const control = this.contactForm.controls[field];
    if (!control.touched || !control.errors) {
      return null;
    }
    const messages = ERROR_MESSAGES[field];
    const code = Object.keys(control.errors).find(key => key in messages);
    return code ? messages[code] : null;
  }

  protected onSubmit(): void {
    this.submittedAttempt.set(true);
    this.successMessage.set(null);

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.messageService.send(this.contactForm.getRawValue());
    this.successMessage.set(SUCCESS_TEXT);
    this.submittedAttempt.set(false);
    this.contactForm.reset();
  }
}