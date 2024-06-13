import { TestBed } from '@angular/core/testing';

import { SubmenuService } from './submenu.service';

describe('SubmenuService', () => {
  let service: SubmenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubmenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
