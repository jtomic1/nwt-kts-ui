import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { NoteType } from 'src/app/shared/models/enums/NoteType';
import { Note } from 'src/app/shared/models/Note';
import { NoteService } from 'src/app/shared/services/note-service/note.service';
import { BlockingDialogComponent } from '../adminpage-dialogs/blocking-dialog/blocking-dialog.component';

@Component({
  selector: 'app-list-user',
  templateUrl: './list-user.component.html',
  styleUrls: ['./list-user.component.css']
})
export class ListUserComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() id!: number;
  @Input() name: string = '';
  @Input() surname: string = '';
  @Input() email: string = '';
  @Input() phone: string = '';

  @Output() onDeleted = new EventEmitter<number>();

  title: string = 'Unesite napomenu';
  placeholder: string = 'Unesite tekst';
  noteType: NoteType = NoteType.BLOCK_NOTICE;
  noteContent: string = '';

  constructor(private noteService: NoteService,
              private dialog: MatDialog) { }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.noteService.getBlockNote(this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: Note) => {          
          if (res !== null) {
            this.noteContent = res.content;
          }
        },
        error: (err) => {
          console.log(err.error.message);
        }
      });
  }

  updateBlockNote(noteContent: string): void {    
    this.noteContent = noteContent;
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    dialogConfig.restoreFocus = false;
    dialogConfig.data = {id: this.id};

    const dialogRef = this.dialog.open(BlockingDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {      
      if (result === true) {
        this.onDeleted.emit(this.id);
      }
    });
  }

}
