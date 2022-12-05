import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartpageMapComponent } from './startpage-map.component';

describe('StartpageMapComponent', () => {
  let component: StartpageMapComponent;
  let fixture: ComponentFixture<StartpageMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StartpageMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StartpageMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
