import { Component, Input, OnInit } from '@angular/core';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { TokensService } from '../../services/tokens-service/tokens.service';

@Component({
  selector: 'app-tokens-count',
  templateUrl: './tokens-count.component.html',
  styleUrls: ['./tokens-count.component.css']
})
export class TokensCountComponent implements OnInit {

  userId:number = -1;
  @Input() isMuted :boolean = false;
  
  @Input() value : number= 0;
  @Input()  isCurrentUserTokens:boolean = false;
  constructor(
    private tokensService:TokensService,
    private loginService:LoginService
  ) { }
  
  
  ngOnInit(): void {
    if( this.isCurrentUserTokens ){
      this.loginService.userChanged.subscribe(
        (user) =>{
          if(user != null ){
            this.userId = user.id;
            this.updateTokensForUser();
          }
        }
      )
      this.tokensService.currentUserTokensChanged.subscribe(
        (data)=>{
          this.updateTokensForUser();
        }
      )
    }

  }

  updateTokensForUser(){
    this.tokensService.getTokensForUser(this.userId).subscribe( 
      (data)=>{
        this.value = data;  
      }
    );
  }

}
