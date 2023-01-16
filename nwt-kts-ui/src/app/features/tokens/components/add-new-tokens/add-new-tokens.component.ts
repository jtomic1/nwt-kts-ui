import { Component, OnInit, ViewChild } from '@angular/core';
import { ICreateOrderRequest, IPayPalConfig } from 'ngx-paypal';
import { TokensDTO } from 'src/app/shared/models/ToknesDTO';
import { MessageService, MessageType } from 'src/app/shared/services/message-service/message.service';
import { TokensService } from 'src/app/shared/services/tokens-service/tokens.service';
import { TokensCountComponent } from 'src/app/shared/components/tokens-count/tokens-count.component';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';

@Component({
  selector: 'app-add-new-tokens',
  templateUrl: './add-new-tokens.component.html',
  styleUrls: ['./add-new-tokens.component.css']
})
export class AddNewTokensComponent implements OnInit {
  
  value : number | undefined;
  

  public payPalConfig?: IPayPalConfig;

  showSuccess:boolean = false;

  showPayPal : boolean = false;

  tokensForUser:TokensDTO = {
    userId: -1,
    tokens: 0
  }

  @ViewChild(TokensCountComponent)
  private tokensCountComponent! : TokensCountComponent;
  
  constructor(
    private tokensService:TokensService,
    private messageService:MessageService,
    private loginService:LoginService
  ) { }

  ngOnInit(): void {
    this.loginService.userChanged.subscribe(
      (user)=>{
        this.tokensForUser.userId = user.id;
      }
    );
  }

  processPayPal(){
    console.log(this.value);
    this.showPayPal = true;
    this.initConfig();
  }

  private initConfig(): void {
    
    this.tokensForUser.tokens = this.value!;


    this.payPalConfig = {
    currency: 'EUR',
    clientId: 'sb',
    createOrderOnClient: (data) => <ICreateOrderRequest>{
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: 'EUR',
            value: this.value!.toString(),
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: this.value!.toString()
              }
            }
          },
          items: [
            {
              name: 'Enterprise Subscription',
              quantity: '1',
              category: 'DIGITAL_GOODS',
              unit_amount: {
                currency_code: 'EUR',
                value: this.value!.toString(),
              },
            }
          ]
        }
      ]
    },
    advanced: {
      commit: 'true'
    },
    style: {
      label: 'paypal',
      layout: 'vertical'
    },
    onApprove: (data, actions) => {
      console.log('onApprove - transaction was approved, but not authorized', data, actions);
      actions.order.get().then((details: any) => {
        console.log('onApprove - you can get full order details inside onApprove: ', details);
      });
    },
    onClientAuthorization: (data) => {
      console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      this.showSuccess = true;
      this.saveTokensForUser();
    },
    onCancel: (data, actions) => {
      console.log('OnCancel', data, actions);
    },
    onError: err => {
      console.log('OnError', err);
    },
    onClick: (data, actions) => {
      console.log('onClick', data, actions);
    },
  };
  }


  saveTokensForUser(){
    this.tokensService.addTokensForUser(this.tokensForUser).subscribe(
      data =>{
        this.messageService.showMessage("Uspešno ste uplatili tokene",MessageType.SUCCESS);
        this.tokensCountComponent.updateTokensForUser();
        this.showPayPal=false;
        this.value = undefined;
        this.tokensService.currentUserTokensChangedSubject.next('');
      }
    );
  }
}
