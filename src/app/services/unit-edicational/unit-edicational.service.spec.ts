import { TestBed } from '@angular/core/testing';

import { UnitEdicationalService } from './unit-edicational.service';

describe('UnitEdicationalService', () => {
  let service: UnitEdicationalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitEdicationalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
