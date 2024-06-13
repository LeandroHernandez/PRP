import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListrepresentativeComponent } from './listrepresentative.component';

describe('ListrepresentativeComponent', () => {
  let component: ListrepresentativeComponent;
  let fixture: ComponentFixture<ListrepresentativeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListrepresentativeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListrepresentativeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
