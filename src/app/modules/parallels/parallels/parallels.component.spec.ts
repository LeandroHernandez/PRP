import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParallelsComponent } from './parallels.component';

describe('ParallelsComponent', () => {
  let component: ParallelsComponent;
  let fixture: ComponentFixture<ParallelsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParallelsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParallelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
