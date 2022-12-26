import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-new-tokens',
  templateUrl: './add-new-tokens.component.html',
  styleUrls: ['./add-new-tokens.component.css']
})
export class AddNewTokensComponent implements OnInit {
  
  value : number = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
