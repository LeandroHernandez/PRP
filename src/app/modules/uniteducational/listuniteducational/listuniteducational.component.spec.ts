import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListuniteducationalComponent } from './listuniteducational.component';

describe('ListuniteducationalComponent', () => {
  let component: ListuniteducationalComponent;
  let fixture: ComponentFixture<ListuniteducationalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListuniteducationalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListuniteducationalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
