import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartpageTabContainerComponent } from './startpage-tab-container.component';

describe('StartpageTabContainerComponent', () => {
  let component: StartpageTabContainerComponent;
  let fixture: ComponentFixture<StartpageTabContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartpageTabContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartpageTabContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
