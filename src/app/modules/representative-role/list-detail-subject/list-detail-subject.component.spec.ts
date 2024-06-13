import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDetailSubjectComponent } from './list-detail-subject.component';

describe('ListDetailSubjectComponent', () => {
  let component: ListDetailSubjectComponent;
  let fixture: ComponentFixture<ListDetailSubjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDetailSubjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDetailSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
