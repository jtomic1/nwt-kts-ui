import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { LiveChatComponent } from '../live-chat/live-chat.component';

@Component({
  selector: 'app-live-chat-client',
  templateUrl: './live-chat-client.component.html',
  styleUrls: ['./live-chat-client.component.css']
})
export class LiveChatClientComponent implements OnInit {
  
  receiverIdTXT:string ="";
  currentUserId:number=-1;

  @ViewChild(LiveChatComponent)
  private liveChatComponent!: LiveChatComponent;
  
  constructor(
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.currentUserId = this.loginService.user?.id!;
  }




}
