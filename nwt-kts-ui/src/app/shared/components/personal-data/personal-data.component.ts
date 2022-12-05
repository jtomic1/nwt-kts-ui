import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css'],
})
export class PersonalDataComponent implements OnInit {
  @Input() form: FormGroup = new FormGroup({});
  constructor() {}

  ngOnInit(): void {}
}
