import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUploadLogoComponent } from './modal-upload-logo.component';

describe('ModalUploadLogoComponent', () => {
  let component: ModalUploadLogoComponent;
  let fixture: ComponentFixture<ModalUploadLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalUploadLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalUploadLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
