import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InRideDriverDialogComponent } from './in-ride-driver-dialog.component';

describe('InRideDriverDialogComponent', () => {
  let component: InRideDriverDialogComponent;
  let fixture: ComponentFixture<InRideDriverDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InRideDriverDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InRideDriverDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
