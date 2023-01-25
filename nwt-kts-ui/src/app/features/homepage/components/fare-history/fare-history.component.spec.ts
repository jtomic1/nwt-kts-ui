import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FareHistoryComponent } from './fare-history.component';

describe('FareHistoryComponent', () => {
  let component: FareHistoryComponent;
  let fixture: ComponentFixture<FareHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FareHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FareHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
