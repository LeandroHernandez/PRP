import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportlearninglevelComponent } from './reportlearninglevel.component';

describe('ReportlearninglevelComponent', () => {
  let component: ReportlearninglevelComponent;
  let fixture: ComponentFixture<ReportlearninglevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportlearninglevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportlearninglevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
