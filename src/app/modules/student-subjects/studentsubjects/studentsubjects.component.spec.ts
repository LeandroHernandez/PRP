import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsubjectsComponent } from './studentsubjects.component';

describe('StudentsubjectsComponent', () => {
  let component: StudentsubjectsComponent;
  let fixture: ComponentFixture<StudentsubjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentsubjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentsubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
