import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewRideDriverDialogComponent } from './new-ride-driver-dialog.component';

describe('NewRideDriverDialogComponent', () => {
  let component: NewRideDriverDialogComponent;
  let fixture: ComponentFixture<NewRideDriverDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewRideDriverDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewRideDriverDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
