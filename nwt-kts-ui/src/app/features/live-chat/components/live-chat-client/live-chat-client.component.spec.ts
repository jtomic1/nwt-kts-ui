import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveChatClientComponent } from './live-chat-client.component';

describe('LiveChatClientComponent', () => {
  let component: LiveChatClientComponent;
  let fixture: ComponentFixture<LiveChatClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveChatClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveChatClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
