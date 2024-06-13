import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadResourcesComponent } from './upload-resources.component';

describe('UploadResourcesComponent', () => {
  let component: UploadResourcesComponent;
  let fixture: ComponentFixture<UploadResourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadResourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
