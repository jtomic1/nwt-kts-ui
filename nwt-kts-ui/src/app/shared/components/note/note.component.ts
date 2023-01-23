import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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

  form: FormGroup;

  isDisabled: boolean = true;

  @Output() noteSent: EventEmitter<boolean> = new EventEmitter<boolean>();

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
  }

  sendNote(): void {
    var note: Note = {
      offenderId: this.offenderId,
      noteType: this.noteType,
      content: this.form.controls['textarea'].value
    }
    this.noteService
      .sendNote(note)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.form.reset({
            textarea: ''
          });        
          this.form.controls['textarea'].setErrors(null);
          this.messageService.showMessage('Poruka je poslata.', MessageType.SUCCESS);
          this.noteSent.emit(true);
        },
        error: (err) => {
          this.messageService.showMessage(err.error.message, MessageType.ERROR);
          this.noteSent.emit(false);
        }
      });
  }

}
