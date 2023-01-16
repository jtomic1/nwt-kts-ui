import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideRequestDialogComponent } from './ride-request-dialog.component';

describe('RideRequestDialogComponent', () => {
  let component: RideRequestDialogComponent;
  let fixture: ComponentFixture<RideRequestDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RideRequestDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RideRequestDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
