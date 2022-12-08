import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserDTO } from 'src/app/shared/models/UserDTO';
import { UserService } from 'src/app/shared/services/user-service/user.service';

@Component({
  selector: 'app-chat-head',
  templateUrl: './chat-head.component.html',
  styleUrls: ['./chat-head.component.css']
})
export class ChatHeadComponent implements OnInit,OnDestroy {

  destroy$: Subject<boolean> = new Subject<boolean>();
  
  @Output() clickedChatHead = new EventEmitter<UserDTO>();

  @Input() userId:number = -1;

  user: UserDTO = {
    id: 0,
    email: '',
    name: '',
    lastName: ''
  };

  lastMessage : string = "";

  constructor(
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    
    this.userService
      .getUser(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.user = data;
      });
  }

  chatHeadClicked(){
    this.clickedChatHead.emit(this.user);
  }

  
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
