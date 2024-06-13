import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowPlanificationComponent } from './show-planification.component';

describe('ShowPlanificationComponent', () => {
  let component: ShowPlanificationComponent;
  let fixture: ComponentFixture<ShowPlanificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowPlanificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowPlanificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
