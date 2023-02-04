import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { User } from 'src/app/shared/models/User';
import { MessageService, MessageType } from 'src/app/shared/services/message-service/message.service';
import { UserService } from 'src/app/shared/services/user-service/user.service';

export interface DialogData {
  id: number
}

@Component({
  selector: 'app-blocking-dialog',
  templateUrl: './blocking-dialog.component.html',
  styleUrls: ['./blocking-dialog.component.css']
})
export class BlockingDialogComponent implements  OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  deleted: boolean = false;

  constructor(private dialogRef: MatDialogRef<BlockingDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private userService: UserService,
              private messageService: MessageService) { }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  

  onCancelClick(): void {
    this.dialogRef.close();
  }

  blockUser(): void {
    this.userService.blockUser(this.data.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: User) => {
          this.deleted = true;
          this.messageService.showMessage('Korisnik je blokiran!', MessageType.SUCCESS);        
          this.dialogRef.close(true);        
        },
        error: (err) => {
          console.log(err.error.message);
        }
      })
  }
  
}
