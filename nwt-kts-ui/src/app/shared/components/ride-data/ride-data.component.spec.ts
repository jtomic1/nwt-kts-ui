import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RideDataComponent } from './ride-data.component';

describe('RideDataComponent', () => {
  let component: RideDataComponent;
  let fixture: ComponentFixture<RideDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RideDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RideDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
