import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminParallelOfEduUnitComponent } from './admin-parallel-of-edu-unit.component';

describe('AdminParallelOfEduUnitComponent', () => {
  let component: AdminParallelOfEduUnitComponent;
  let fixture: ComponentFixture<AdminParallelOfEduUnitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminParallelOfEduUnitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminParallelOfEduUnitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
