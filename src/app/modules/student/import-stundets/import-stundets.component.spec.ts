import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportStundetsComponent } from './import-stundets.component';

describe('ImportStundetsComponent', () => {
  let component: ImportStundetsComponent;
  let fixture: ComponentFixture<ImportStundetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportStundetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportStundetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
