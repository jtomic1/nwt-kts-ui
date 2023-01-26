import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientFareDetailsComponent } from './client-fare-details.component';

describe('ClientFareDetailsComponent', () => {
  let component: ClientFareDetailsComponent;
  let fixture: ComponentFixture<ClientFareDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientFareDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientFareDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
