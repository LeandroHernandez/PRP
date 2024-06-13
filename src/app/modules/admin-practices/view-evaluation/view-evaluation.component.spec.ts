import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEvaluationComponent } from './view-evaluation.component';

describe('ViewEvaluationComponent', () => {
  let component: ViewEvaluationComponent;
  let fixture: ComponentFixture<ViewEvaluationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEvaluationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
