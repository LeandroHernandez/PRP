import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListacademicyearComponent } from './listacademicyear.component';

describe('ListacademicyearComponent', () => {
  let component: ListacademicyearComponent;
  let fixture: ComponentFixture<ListacademicyearComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListacademicyearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListacademicyearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
