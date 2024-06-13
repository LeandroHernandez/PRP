import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepresentativeCalendarComponent } from './representative-calendar.component';

describe('RepresentativeCalendarComponent', () => {
  let component: RepresentativeCalendarComponent;
  let fixture: ComponentFixture<RepresentativeCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepresentativeCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepresentativeCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
