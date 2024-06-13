import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubLevelsComponent } from './sublevels.component';

describe('SubLevelsComponent', () => {
  let component: SubLevelsComponent;
  let fixture: ComponentFixture<SubLevelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubLevelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubLevelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
