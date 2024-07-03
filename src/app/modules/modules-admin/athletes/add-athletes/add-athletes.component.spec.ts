import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAthletesComponent } from './add-athletes.component';

describe('AddAthletesComponent', () => {
  let component: AddAthletesComponent;
  let fixture: ComponentFixture<AddAthletesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAthletesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAthletesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
