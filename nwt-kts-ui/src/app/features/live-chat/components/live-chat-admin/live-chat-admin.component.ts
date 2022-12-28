import { Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Role } from 'src/app/shared/models/enums/Role';
import { User } from 'src/app/shared/models/User';
import { MessageService } from 'src/app/shared/services/message-service/message.service';
import { UserService } from 'src/app/shared/services/user-service/user.service';
import { MessageDTO } from '../../models/MessageDTO';
import { ChatMessagesService } from '../../services/chat-messages-service/chat-messages.service';
import { ChatHeadComponent } from '../chat-head/chat-head.component';
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
  allUsers: User[] = [];
  selectedUser:User = {
    id: -1,
    email: '',
    name: '',
    lastName: '',
    active: false,
    blocked: false,
    phone: '',
    username: '',
    roleString: '',
    role:Role.USER
  }

  messageDTO: MessageDTO = {
    isAdminMessage: true,
    userId: this.receiverId,
    content: '',
    timeStamp: null,
  };

  @ViewChild(LiveChatComponent)
  private liveChatComponent!: LiveChatComponent;

  @ViewChildren(ChatHeadComponent)
  private chatHeads! : QueryList<ChatHeadComponent>;


  constructor(
    private userService:UserService,
  ) {}

  ngOnInit() {

    this.userService
      .getAllUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.allUsers = data;
        console.log(this.allUsers);
      });
    
  }

  newMessageInContacts(messageDTO:MessageDTO){
      console.log(messageDTO);
      this.chatHeads.forEach(chatHead => {
        if(chatHead.userId == messageDTO.userId)
        {  
          chatHead.newMessage(messageDTO.content);
          if( chatHead.userId != this.selectedUser.id)
            chatHead.newMessageAnimation()
        }
      });
  }

  changeReceiver(user: User) {
    this.selectedUser = user;
    this.receiverId = user.id;
    this.liveChatComponent.receiverId = user.id;
    this.liveChatComponent.getAndDisplayMessagesHistory();
    this.removeVisualizationFromContact(user.id);

    this.chatHeads.forEach(chatHead => {
      if(chatHead.userId == user.id)
      {  
        chatHead.activeChat = true;
      }
      else{
        chatHead.activeChat = false;
      }
    });
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
