import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouriteRidesComponent } from './favourite-rides.component';

describe('FavouriteRidesComponent', () => {
  let component: FavouriteRidesComponent;
  let fixture: ComponentFixture<FavouriteRidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FavouriteRidesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FavouriteRidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
