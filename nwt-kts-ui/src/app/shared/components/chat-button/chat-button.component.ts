import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { environment } from 'src/environments/environment';
import { Role } from '../../models/enums/Role';

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
      (user) =>{
        if(user != null ){
          this.loggedUserId = user.id;
          if(user.role ==Role.ADMIN){
          this.socket.emit('join', 'admin');
          this.socket.emit('setUserId', 'admin');
          }else{
          this.socket.emit('join', user.id,toString());
          this.socket.emit('setUserId', user.id.toString());
          }
          this.socket.on('private message', (data: any) => {
            this.isAnimated = true;
          });
          console.log('socket for '+user.id);
        }
      }
    )

  }

  disableAnimation(){
    this.isAnimated = false;
  }


}
