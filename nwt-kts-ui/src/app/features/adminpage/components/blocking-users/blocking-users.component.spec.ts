import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockingUsersComponent } from './blocking-users.component';

describe('BlockingUsersComponent', () => {
  let component: BlockingUsersComponent;
  let fixture: ComponentFixture<BlockingUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockingUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockingUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
