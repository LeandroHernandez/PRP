import { TestBed } from '@angular/core/testing';

import { TeacherSubjectsService } from './teacher-subjects.service';

describe('TeacherSubjectsService', () => {
  let service: TeacherSubjectsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherSubjectsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
