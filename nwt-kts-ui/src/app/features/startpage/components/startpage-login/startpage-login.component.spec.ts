import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartpageLoginComponent } from './startpage-login.component';

describe('StartpageLoginComponent', () => {
  let component: StartpageLoginComponent;
  let fixture: ComponentFixture<StartpageLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartpageLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartpageLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
