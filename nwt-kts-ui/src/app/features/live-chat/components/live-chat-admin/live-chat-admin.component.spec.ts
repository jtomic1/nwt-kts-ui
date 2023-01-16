import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveChatAdminComponent } from './live-chat-admin.component';

describe('LiveChatAdminComponent', () => {
  let component: LiveChatAdminComponent;
  let fixture: ComponentFixture<LiveChatAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveChatAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LiveChatAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
