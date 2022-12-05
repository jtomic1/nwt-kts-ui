import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartpageRegisterComponent } from './startpage-register.component';

describe('StartpageRegisterComponent', () => {
  let component: StartpageRegisterComponent;
  let fixture: ComponentFixture<StartpageRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartpageRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartpageRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
