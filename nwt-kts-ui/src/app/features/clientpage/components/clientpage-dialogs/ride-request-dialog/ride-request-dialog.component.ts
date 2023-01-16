import { Component, OnInit,Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-ride-request-dialog',
  templateUrl: './ride-request-dialog.component.html',
  styleUrls: ['./ride-request-dialog.component.css']
})
export class RideRequestDialogComponent implements OnInit {

  processIsFinished: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data:{message: string}) { }

  ngOnInit(): void {
  }

  setMessage( newMessage : string){
    this.data.message = newMessage;
  }

  finishProcess(){
    this.processIsFinished = true;
  }
}
