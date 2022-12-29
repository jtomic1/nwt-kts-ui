import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { environment } from 'src/environments/environment';

const io = require('socket.io-client');

@Component({
  selector: 'app-chat-button',
  templateUrl: './chat-button.component.html',
  styleUrls: ['./chat-button.component.css']
})
export class ChatButtonComponent implements OnInit {

  loggedUserId:number = -1;
  
  socket: any;

  isAnimated:boolean = false;


  constructor(
    private loginService:LoginService
  ) { }
  
  ngOnInit(): void {
    
    this.socket = io(environment.chatSocketEndpoint);


    this.loginService.userChanged.subscribe(
      (data) =>{
        
        this.socket.on('private message', (data: any) => {
          // console.log(data);
          this.isAnimated = true;
          console.log("stigla!")
        });
        this.loggedUserId = data.id;
        this.socket.emit('join', data.id,toString());
        this.socket.emit('setUserId', data.id.toString());
        console.log("povezan na soket "+data.id.toString());
      }
    )

  }

  disableAnimation(){
    this.isAnimated = false;
  }


}
