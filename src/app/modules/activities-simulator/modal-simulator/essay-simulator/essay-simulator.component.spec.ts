import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EssaySimulatorComponent } from './essay-simulator.component';

describe('EssaySimulatorComponent', () => {
  let component: EssaySimulatorComponent;
  let fixture: ComponentFixture<EssaySimulatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EssaySimulatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EssaySimulatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
