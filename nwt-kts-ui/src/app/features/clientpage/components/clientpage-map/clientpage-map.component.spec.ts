import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientpageMapComponent } from './clientpage-map.component';

describe('ClientpageMapComponent', () => {
  let component: ClientpageMapComponent;
  let fixture: ComponentFixture<ClientpageMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientpageMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientpageMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
