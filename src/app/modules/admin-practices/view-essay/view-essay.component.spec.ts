import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewEssayComponent } from './view-essay.component';

describe('ViewEssayComponent', () => {
  let component: ViewEssayComponent;
  let fixture: ComponentFixture<ViewEssayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEssayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEssayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
