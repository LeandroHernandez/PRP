import { TestBed } from '@angular/core/testing';

import { EducationalunitService } from './educationalunit.service';

describe('EducationalunitService', () => {
  let service: EducationalunitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EducationalunitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
