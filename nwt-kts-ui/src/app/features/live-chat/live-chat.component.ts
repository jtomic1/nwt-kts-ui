import { Component, OnInit } from '@angular/core';

const io = require("socket.io-client");
const SOCKET_ENDPOINT = 'localhost:3000';

@Component({
  selector: 'app-live-chat',
  templateUrl: './live-chat.component.html',
  styleUrls: ['./live-chat.component.css']
})
export class LiveChatComponent implements OnInit {

  socket:any;
  message:string = "";
  constructor() { }

  ngOnInit() {
      this.setupSocketConnection();
  }
  setupSocketConnection() {
      this.socket = io(SOCKET_ENDPOINT);
      this.socket.on('message-broadcast', (data: string) => {
        if (data) {
         const element = document.createElement('li');
         element.innerHTML = data;
         element.style.background = 'white';
         element.style.padding =  '15px 30px';
         element.style.margin = '10px';
         let x =document.getElementById('message-list') ; 
         if(x != null){
            x.appendChild(element);
         }

        }
       });
  }
  SendMessage() {
    console.log(this.message);
    this.socket.emit('message', this.message);
    const element = document.createElement('li');
    element.innerHTML = this.message;
    element.style.background = 'white';
    element.style.padding =  '15px 30px';
    element.style.margin = '10px';
    element.style.textAlign = 'right';
    let x =document.getElementById('message-list') ; 
    if(x != null){
       x.appendChild(element);
    }
    this.message = '';
  }
}
