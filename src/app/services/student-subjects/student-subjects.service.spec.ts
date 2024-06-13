import { TestBed } from '@angular/core/testing';

import { StudentSubjectsService } from './student-subjects.service';

describe('StudentSubjectsService', () => {
  let service: StudentSubjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentSubjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
