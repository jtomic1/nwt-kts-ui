import { Component, Input, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { Ride } from 'src/app/shared/models/Ride';
import { TokensService } from 'src/app/shared/services/tokens-service/tokens.service';

@Component({
  selector: 'app-ride-payment',
  templateUrl: './ride-payment.component.html',
  styleUrls: ['./ride-payment.component.css']
})
export class RidePaymentComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() ride!:Ride;
  leftTokens: number = 0;
  constructor(
    private loginService:LoginService,
    private tokenService:TokensService
  ) { }

  ngOnInit(): void {
    this.calculateLeftTokens();
  }

  calculateLeftTokens(){
    this.tokenService.getTokensForUser(this.loginService.user!.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      {
        next:(res)=>{
          let currentTokens:number = res;
          this.leftTokens = currentTokens - this.ride.price;
        }
      }
    );
  }
}
