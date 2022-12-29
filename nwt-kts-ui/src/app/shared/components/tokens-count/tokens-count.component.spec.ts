import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokensCountComponent } from './tokens-count.component';

describe('TokensCountComponent', () => {
  let component: TokensCountComponent;
  let fixture: ComponentFixture<TokensCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokensCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokensCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
