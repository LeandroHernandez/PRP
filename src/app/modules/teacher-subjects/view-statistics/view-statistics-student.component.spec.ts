import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewStatisticsStudentComponent } from './view-statistics-student.component';

describe('ViewStatisticsStudentComponent', () => {
  let component: ViewStatisticsStudentComponent;
  let fixture: ComponentFixture<ViewStatisticsStudentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStatisticsStudentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewStatisticsStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
