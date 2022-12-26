import { Component, OnInit } from '@angular/core';
import { TokensService } from 'src/app/shared/services/tokens-service/tokens.service';

@Component({
  selector: 'app-tokens-count',
  templateUrl: './tokens-count.component.html',
  styleUrls: ['./tokens-count.component.css']
})
export class TokensCountComponent implements OnInit {

  value : number= 0;
  constructor(
    private tokensService:TokensService
  ) { }

  ngOnInit(): void {
    this.updateTokensForUser();
  }

  updateTokensForUser(){
    this.tokensService.getTokensForUser(1).subscribe( 
      (data)=>{
        this.value = data;  
      }
    );
  }

}
