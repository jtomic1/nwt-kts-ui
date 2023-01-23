import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverChangeListComponent } from './driver-change-list.component';

describe('DriverChangeListComponent', () => {
  let component: DriverChangeListComponent;
  let fixture: ComponentFixture<DriverChangeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DriverChangeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DriverChangeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
