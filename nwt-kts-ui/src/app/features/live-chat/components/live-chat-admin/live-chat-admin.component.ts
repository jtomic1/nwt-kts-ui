import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { UserDTO } from 'src/app/shared/models/UserDTO';
import { MessageService } from 'src/app/shared/services/message-service/message.service';
import { UserService } from 'src/app/shared/services/user-service/user.service';
import { MessageDTO } from '../../models/MessageDTO';
import { ChatMessagesService } from '../../services/chat-messages-service/chat-messages.service';
import { LiveChatComponent } from '../live-chat/live-chat.component';

@Component({
  selector: 'app-live-chat-admin',
  templateUrl: './live-chat-admin.component.html',
  styleUrls: ['./live-chat-admin.component.css'],
})
export class LiveChatAdminComponent implements OnInit, OnDestroy {
  
  destroy$: Subject<boolean> = new Subject<boolean>();
  socket: any;
  message: string = '';
  receiverId: number = -1;
  allUsers: UserDTO[] = [];
  selectedUser:UserDTO = {
    id: 0,
    email: '',
    name: '',
    lastName: ''
  }

  messageDTO: MessageDTO = {
    isAdminMessage: true,
    userId: this.receiverId,
    content: '',
    timeStamp: null,
  };

  @ViewChild(LiveChatComponent)
  private liveChatComponent!: LiveChatComponent;


  constructor(
    private chatMessageService: ChatMessagesService,
    private messageService: MessageService,
    private userService:UserService,
  ) {}

  ngOnInit() {

    this.userService
      .getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.allUsers = data;
      });
    
  }

  newMessageInContacts(messageDTO:MessageDTO){

  }

  changeReceiver(user: UserDTO) {
    this.selectedUser = user;
    this.receiverId = user.id;
    this.liveChatComponent.receiverId = user.id;
    this.liveChatComponent.getAndDisplayMessagesHistory();
    this.removeVisualizationFromContact(user.id);
  }

  displayLastMessage(senderId:number, content:string){


  }
  
  visualizeNewMessageInContacts(senderId: number) {
    const element = document.getElementById(`user_${senderId}`);
    if (element != null) {
      element.classList.add('blink');
    }
  }

  removeVisualizationFromContact(userId: number) {
    const element = document.getElementById(`user_${userId}`);
    if (element != null) {
      element.classList.remove('blink');
    }
  }

  clearChat() {
    let x = document.getElementById('message-list');
    if (x != null) {
      x.innerHTML = '';
    }
  }

  createNewContact(senderId: number, content: string) {
    //TODO: implement new contact!
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
