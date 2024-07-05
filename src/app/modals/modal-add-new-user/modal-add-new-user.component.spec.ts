import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddNewUserComponent } from './modal-add-new-user.component';

describe('ModalAddNewUserComponent', () => {
  let component: ModalAddNewUserComponent;
  let fixture: ComponentFixture<ModalAddNewUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddNewUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddNewUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
