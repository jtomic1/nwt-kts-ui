import { Component, OnInit, ViewChild } from '@angular/core';
import { LiveChatComponent } from '../live-chat/live-chat.component';

@Component({
  selector: 'app-live-chat-client',
  templateUrl: './live-chat-client.component.html',
  styleUrls: ['./live-chat-client.component.css']
})
export class LiveChatClientComponent implements OnInit {
  
  receiverIdTXT:string ="";

  @ViewChild(LiveChatComponent)
  private liveChatComponent!: LiveChatComponent;
  
  constructor() { }

  ngOnInit(): void {
  }

  joinChanel(){
    this.liveChatComponent.joinChanel(this.receiverIdTXT);
  }

}
