import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAddNewUEComponent } from './modal-add-new-ue.component';

describe('ModalAddNewUEComponent', () => {
  let component: ModalAddNewUEComponent;
  let fixture: ComponentFixture<ModalAddNewUEComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalAddNewUEComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalAddNewUEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
