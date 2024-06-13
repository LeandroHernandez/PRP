import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSimulatorComponent } from './modal-simulator.component';

describe('ModalSimulatorComponent', () => {
  let component: ModalSimulatorComponent;
  let fixture: ComponentFixture<ModalSimulatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalSimulatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
