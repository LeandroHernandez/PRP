import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListSubjectsTeacherComponent } from './list-subjects-teacher.component';

describe('ListSubjectsTeacherComponent', () => {
  let component: ListSubjectsTeacherComponent;
  let fixture: ComponentFixture<ListSubjectsTeacherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListSubjectsTeacherComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListSubjectsTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
