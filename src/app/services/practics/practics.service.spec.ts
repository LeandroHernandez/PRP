import { TestBed } from '@angular/core/testing';

import { PracticsService } from './practics.service';

describe('PracticsService', () => {
  let service: PracticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PracticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
