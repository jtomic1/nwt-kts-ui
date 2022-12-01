import { Component, OnInit } from '@angular/core';

const io = require("socket.io-client");
const SOCKET_ENDPOINT = 'localhost:3000';

@Component({
  selector: 'app-live-chat-admin',
  templateUrl: './live-chat-admin.component.html',
  styleUrls: ['./live-chat-admin.component.css']
})
export class LiveChatAdminComponent implements OnInit {

  socket:any;
  message:string = "";
  receiver:string = "";
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

       this.socket.on('private message', (data:any) => {
        if (data) {
            const element = document.createElement('li');
            element.innerHTML = data.from + " ~ " + data.content;
            element.style.background = 'white';
            element.style.padding =  '15px 30px';
            element.style.margin = '10px';
            let x =document.getElementById('message-list') ; 
            if(x != null){
                x.appendChild(element);
            }
        }
       });

       this.socket.emit('join','admin');
  }
  SendMessage() {
    console.log(this.message);
    this.socket.emit('private message', {content:this.message, to:this.receiver});
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

  changeReceiver(user:string){
    this.receiver = user;
  }
}
