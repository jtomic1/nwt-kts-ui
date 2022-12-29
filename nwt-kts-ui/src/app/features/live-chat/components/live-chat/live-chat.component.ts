import { DatePipe } from '@angular/common';
import { Component, OnInit, OnDestroy, Input, Output,EventEmitter } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import {
  MessageService,
  MessageType,
} from 'src/app/shared/services/message-service/message.service';
import { environment } from 'src/environments/environment';
import { MessageDTO } from '../../models/MessageDTO';
import { ChatMessagesService } from '../../services/chat-messages-service/chat-messages.service';

const io = require('socket.io-client');

@Component({
  selector: 'app-live-chat',
  templateUrl: './live-chat.component.html',
  styleUrls: ['./live-chat.component.css'],
  providers: [DatePipe],
})
export class LiveChatComponent implements OnInit, OnDestroy {
  
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() isAdminChat: boolean = false;
  @Input() receiverId: number = 1;
  
  messageHistory: MessageDTO[] = [];

  socket: any;
  message: string = '';

  messageDTO: MessageDTO = {
    userId: this.receiverId,
    isAdminMessage: this.isAdminChat,
    content: '',
    timeStamp: '',
  };

  @Output() newMessageArived = new EventEmitter<MessageDTO>();



  constructor(
    private chatMessageService: ChatMessagesService,
    private messageService: MessageService,
    private datePipe: DatePipe
  ) {
  }

  ngOnInit() {
    
    this.setupSocketConnection();
    this.getAndDisplayMessagesHistory();
  }

  setupSocketConnection() {
    this.socket = io(environment.chatSocketEndpoint);

    this.socket.on('private message', (data: any) => {
      // console.log(data);
      this.receiveNewMessage(data);
      this.newMessageArived.emit(data);
      
    });
    if(this.isAdminChat)
    {
      this.joinChanel('admin');
    }
    else{
      this.joinChanel(this.receiverId.toString());
    }

    console.log("socket set up!")
  }

  joinChanel(userId:string) {
    console.log(`user_${userId} joined his chanel`);
    this.socket.emit('join', userId);
    this.socket.emit('setUserId', userId);
    this.receiverId = +userId;
  }


  receiveNewMessage(messageDTO:MessageDTO){
    if(this.isAdminChat){
      if(this.receiverId == messageDTO.userId)
        this.receiveMessageInChat(messageDTO.content);
        
    }
    else{
      this.receiveMessageInChat(messageDTO.content);
    }
  }

  getAndDisplayMessagesHistory(){
    this.chatMessageService
            .getMessagesForUser(this.receiverId)
            .pipe(takeUntil(this.destroy$))
            .subscribe((messages)=>{
              this.messageHistory = messages;
              this.displayMessagesHistory();
            });
  }


  displayMessagesHistory() {
    this.clearChat();
    this.messageHistory.forEach((message) => {
      if (this.isAdminChat) {
        if (message.isAdminMessage) {
          this.sendMessageInChat(message.content);
        } else {
          this.receiveMessageInChat(message.content);
        }
      } else {
        if (message.isAdminMessage) {
          this.receiveMessageInChat(message.content);
        } else {
          this.sendMessageInChat(message.content);
        }
      }
    });
  }

  SendMessage() {
    console.log(this.message);
    if (this.isAdminChat){
      this.socket.emit('private message', {
        content: this.message,
        to: this.receiverId.toString(),
      });
    }
    else{
      this.socket.emit('private message', {
        content: this.message,
        to: 'admin',
      });
    }
    this.saveMessageInDB();
    this.sendMessageInChat(this.message);
    this.message = '';
  }

  saveMessageInDB() {
    this.messageDTO.userId = this.receiverId;
    this.messageDTO.content = this.message;
    this.messageDTO.isAdminMessage = this.isAdminChat;
    this.messageDTO.timeStamp = this.datePipe.transform(
      new Date(),
      'YYYY-MM-ddTHH:mm:ss'
    );
    this.chatMessageService
      .addNewMessage(this.messageDTO)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.messageService.showMessage(
          'Vaša poruka je uspešno evidentirana',
          MessageType.SUCCESS
        );
      });
  }

  receiveMessageInChat(message: string) {
    const element = document.createElement('li');
    element.innerHTML = message;
    element.style.background = 'white';
    element.style.padding = '15px 30px';
    element.style.margin = '10px';
    let x = document.getElementById('message-list');
    if (x != null) {
      x.appendChild(element);
    }
  }

  sendMessageInChat(message: string) {
    const element = document.createElement('li');
    element.innerHTML = message;
    element.style.background = 'white';
    element.style.padding = '15px 30px';
    element.style.margin = '10px';
    element.style.textAlign = 'right';
    let x = document.getElementById('message-list');
    if (x != null) {
      x.appendChild(element);
    }
  }

  clearChat() {
    let x = document.getElementById('message-list');
    if (x != null) {
      x.innerHTML = '';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
