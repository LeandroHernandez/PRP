import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EvaluationSimulatorComponent } from './evaluation-simulator.component';

describe('EvaluationSimulatorComponent', () => {
  let component: EvaluationSimulatorComponent;
  let fixture: ComponentFixture<EvaluationSimulatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EvaluationSimulatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EvaluationSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
