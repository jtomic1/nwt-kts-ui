import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PersonalDataMode } from './PersonalDataMode';

@Component({
  selector: 'app-personal-data',
  templateUrl: './personal-data.component.html',
  styleUrls: ['./personal-data.component.css'],
})
export class PersonalDataComponent implements OnInit {
  @Input() form: FormGroup = new FormGroup({});
  @Input() mode: PersonalDataMode = PersonalDataMode.REGISTRATION;
  constructor() {}

  ngOnInit(): void {}

  get showPasswords(): boolean {
    return this.mode === PersonalDataMode.REGISTRATION;
  }
}
