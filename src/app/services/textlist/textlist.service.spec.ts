import { TestBed } from '@angular/core/testing';

import { TextlistService } from './textlist.service';

describe('TextlistService', () => {
  let service: TextlistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
