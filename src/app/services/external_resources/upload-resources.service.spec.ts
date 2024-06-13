import { TestBed } from '@angular/core/testing';

import { UploadResourcesService } from './upload-resources.service';

describe('UploadResourcesService', () => {
  let service: UploadResourcesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadResourcesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
