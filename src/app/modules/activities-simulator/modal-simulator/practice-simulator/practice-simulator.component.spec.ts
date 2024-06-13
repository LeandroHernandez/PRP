import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeSimulatorComponent } from './practice-simulator.component';

describe('PracticeSimulatorComponent', () => {
  let component: PracticeSimulatorComponent;
  let fixture: ComponentFixture<PracticeSimulatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PracticeSimulatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeSimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
