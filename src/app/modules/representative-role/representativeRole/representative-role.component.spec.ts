import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepresentativeRoleComponent } from './representative-role.component';

describe('RepresentativeRoleComponent', () => {
  let component: RepresentativeRoleComponent;
  let fixture: ComponentFixture<RepresentativeRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepresentativeRoleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepresentativeRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
