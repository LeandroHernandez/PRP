import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoStudentPracticeComponent } from './do-student-practice.component';

describe('DoStudentPracticeComponent', () => {
  let component: DoStudentPracticeComponent;
  let fixture: ComponentFixture<DoStudentPracticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoStudentPracticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoStudentPracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
