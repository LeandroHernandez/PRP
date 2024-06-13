import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTeachersComponent } from './import-teachers.component';

describe('ImportTeachersComponent', () => {
  let component: ImportTeachersComponent;
  let fixture: ComponentFixture<ImportTeachersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportTeachersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTeachersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
