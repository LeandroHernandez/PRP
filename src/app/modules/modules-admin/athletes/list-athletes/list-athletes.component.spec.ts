import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAthletesComponent } from './list-athletes.component';

describe('ListAthletesComponent', () => {
  let component: ListAthletesComponent;
  let fixture: ComponentFixture<ListAthletesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAthletesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAthletesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
