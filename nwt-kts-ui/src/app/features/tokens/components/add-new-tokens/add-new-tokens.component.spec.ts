import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewTokensComponent } from './add-new-tokens.component';

describe('AddNewTokensComponent', () => {
  let component: AddNewTokensComponent;
  let fixture: ComponentFixture<AddNewTokensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewTokensComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewTokensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
