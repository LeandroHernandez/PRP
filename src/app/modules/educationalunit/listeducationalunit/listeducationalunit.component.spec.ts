import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeducationalunitComponent } from './listeducationalunit.component';

describe('ListeducationalunitComponent', () => {
  let component: ListeducationalunitComponent;
  let fixture: ComponentFixture<ListeducationalunitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListeducationalunitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeducationalunitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
