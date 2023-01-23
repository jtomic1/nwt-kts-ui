import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { NoteType } from '../../models/enums/NoteType';
import { Note } from '../../models/Note';
import { MessageService, MessageType } from '../../services/message-service/message.service';
import { NoteService } from '../../services/note-service/note.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.css']
})
export class NoteComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() title: string = '';
  @Input() placeholder: string = '';
  @Input() offenderId!: number;
  @Input() noteType!: NoteType;

  @Output() blockNoteFound = new EventEmitter<string>();

  form: FormGroup;

  isDisabled: boolean = true;

  constructor(private noteService: NoteService,
              private messageService: MessageService) { 
    this.form = new FormGroup({
      textarea: new FormControl('')
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    if (this.noteType === NoteType.BLOCK_NOTICE) {
      this.getNote();
    }
  }

  sendNote(): void {
    var note: Note = {
      id: 0,
      senderId: 0,
      offenderId: this.offenderId,
      noteType: this.noteType,
      content: this.form.controls['textarea'].value,
      dateCreated: new Date(),
    }
    this.noteService
      .sendNote(note)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {          
          this.blockNoteFound.emit(this.form.controls['textarea'].value.toString());
          this.form.reset({
            textarea: ''
          });        
          this.form.controls['textarea'].setErrors(null);
          this.messageService.showMessage('Poruka je poslata.', MessageType.SUCCESS);
        },
        error: (err) => {
          this.messageService.showMessage(err.error.message, MessageType.ERROR);
        }
      });
  }

  getNote(): void {
    
  }

}
