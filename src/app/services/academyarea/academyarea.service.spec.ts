import { TestBed } from '@angular/core/testing';

import { AcademyareaService } from './academyarea.service';

describe('AcademyareaService', () => {
  let service: AcademyareaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcademyareaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
