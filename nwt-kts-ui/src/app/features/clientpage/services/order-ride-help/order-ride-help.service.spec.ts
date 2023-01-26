import { TestBed } from '@angular/core/testing';

import { OrderRideHelpService } from './order-ride-help.service';

describe('OrderRideHelpService', () => {
  let service: OrderRideHelpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderRideHelpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
