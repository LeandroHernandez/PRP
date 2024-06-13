import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoStudentEvaluationComponent } from './do-student-evaluation.component';

describe('DoStudentEvaluationComponent', () => {
  let component: DoStudentEvaluationComponent;
  let fixture: ComponentFixture<DoStudentEvaluationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoStudentEvaluationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoStudentEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
