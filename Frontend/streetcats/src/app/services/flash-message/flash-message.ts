import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface FlashMessage {
  text: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number; // in ms
}

@Injectable({ providedIn: 'root' })
export class FlashMessageService {
  private messagesSubject = new Subject<FlashMessage>();
  messages$: Observable<FlashMessage> = this.messagesSubject.asObservable();

  show(message: FlashMessage) {
    // default duration 3s
    this.messagesSubject.next({ duration: 3000, ...message });
  }

  success(text: string, duration?: number) {
    this.show({ text, type: 'success', duration });
  }
  error(text: string, duration?: number) {
    this.show({ text, type: 'error', duration });
  }
  info(text: string, duration?: number) {
    this.show({ text, type: 'info', duration });
  }
  warning(text: string, duration?: number) {
    this.show({ text, type: 'warning', duration });
  }
}
