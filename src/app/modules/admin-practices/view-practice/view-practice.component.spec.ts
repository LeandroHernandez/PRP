import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPracticeComponent } from './view-practice.component';

describe('ViewPracticeComponent', () => {
  let component: ViewPracticeComponent;
  let fixture: ComponentFixture<ViewPracticeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPracticeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPracticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
