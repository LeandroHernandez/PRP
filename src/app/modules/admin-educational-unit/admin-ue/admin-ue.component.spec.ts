import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUEComponent } from './admin-ue.component';

describe('AdminUEComponent', () => {
  let component: AdminUEComponent;
  let fixture: ComponentFixture<AdminUEComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUEComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUEComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
