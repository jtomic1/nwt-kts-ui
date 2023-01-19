import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BurgerMenuIconComponent } from './burger-menu-icon.component';

describe('BurgerMenuIconComponent', () => {
  let component: BurgerMenuIconComponent;
  let fixture: ComponentFixture<BurgerMenuIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BurgerMenuIconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BurgerMenuIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
