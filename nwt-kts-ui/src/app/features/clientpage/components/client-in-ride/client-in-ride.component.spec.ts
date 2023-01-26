import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientInRideComponent } from './client-in-ride.component';

describe('ClientInRideComponent', () => {
  let component: ClientInRideComponent;
  let fixture: ComponentFixture<ClientInRideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientInRideComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientInRideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
