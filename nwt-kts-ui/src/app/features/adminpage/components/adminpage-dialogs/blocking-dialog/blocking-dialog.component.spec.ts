import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockingDialogComponent } from './blocking-dialog.component';

describe('BlockingDialogComponent', () => {
  let component: BlockingDialogComponent;
  let fixture: ComponentFixture<BlockingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockingDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
