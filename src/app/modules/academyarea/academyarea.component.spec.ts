import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademyareaComponent } from './academyarea.component';

describe('AcademyareaComponent', () => {
  let component: AcademyareaComponent;
  let fixture: ComponentFixture<AcademyareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcademyareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcademyareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
