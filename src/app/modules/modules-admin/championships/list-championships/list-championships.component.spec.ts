import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListChampionshipsComponent } from './list-championships.component';

describe('ListChampionshipsComponent', () => {
  let component: ListChampionshipsComponent;
  let fixture: ComponentFixture<ListChampionshipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListChampionshipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListChampionshipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
