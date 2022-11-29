import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-startpage-login',
  templateUrl: './startpage-login.component.html',
  styleUrls: ['./startpage-login.component.css'],
})
export class StartpageLoginComponent implements OnInit {
  form: FormGroup = new FormGroup({});

  faFacebook = faFacebook;
  faGoogle = faGoogle;

  constructor() {}

  ngOnInit(): void {}
}
