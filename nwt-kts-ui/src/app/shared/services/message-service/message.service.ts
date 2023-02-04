import { Component, Inject, Injectable } from '@angular/core';
import { MatSnackBar, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import {
  faX,
  faCheckCircle,
  faExclamationCircle,
  faExclamationTriangle,
  faInfoCircle,
} from '@fortawesome/free-solid-svg-icons';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private matSnack: MatSnackBar) {}

  public showMessage(message: string, type: MessageType) {
    switch (type) {
      case MessageType.SUCCESS: {
        this.showSuccessMessage(message);
        break;
      }
      case MessageType.ERROR: {
        this.showErrorMessage(message);
        break;
      }
      case MessageType.INFO: {
        this.showInfoMessage(message);
        break;
      }
      case MessageType.WARNING: {
        this.showWarningMessage(message);
        break;
      }
    }
  }

  private showErrorMessage(message: string) {
    this.matSnack.openFromComponent(MessageComponent, {
      data: {
        message: message,
        icon: faExclamationTriangle,
      },
      panelClass: 'error',
    });
  }

  private showSuccessMessage(message: string) {
    this.matSnack.openFromComponent(MessageComponent, {
      duration: 5000,
      data: {
        message: message,
        icon: faCheckCircle,
      },
      panelClass: 'success',
    });
  }

  private showInfoMessage(message: string) {
    this.matSnack.openFromComponent(MessageComponent, {
      duration: 5000,
      data: {
        message: message,
        icon: faInfoCircle,
      },
      panelClass: 'info',
    });
  }

  private showWarningMessage(message: string) {
    this.matSnack.openFromComponent(MessageComponent, {
      duration: 5000,
      data: {
        message: message,
        icon: faExclamationCircle,
      },
      panelClass: 'warning',
    });
  }
}

export enum MessageType {
  SUCCESS,
  INFO,
  WARNING,
  ERROR,
}

@Component({
  selector: 'app-success-message',
  template: `
    <div class="message-content">
      <fa-icon class="icon fa-2x" [icon]="data.icon"></fa-icon>
      <p class="message-paragraph">{{ data.message }}</p>
      <fa-icon
        class="close"
        [icon]="this.dismissIcon"
        (click)="snackBar.dismiss()"
      ></fa-icon>
    </div>
  `,
  styles: [
    `
      .message-content {
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
      .icon {
        margin-right: 10px;
      }
      .close {
        cursor: pointer;
        margin-left: auto;
        color: white;
      }
      .message-paragraph {
        margin: 0;
        margin-right: 10px;
        font-size: 1.2em;
      }
    `,
  ],
})
export class MessageComponent {
  dismissIcon = faX;
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any,
    public snackBar: MatSnackBar
  ) {}
}
