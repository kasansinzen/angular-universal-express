import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuStoreComponent } from './menu-store.component';

describe('MenuStoreComponent', () => {
  let component: MenuStoreComponent;
  let fixture: ComponentFixture<MenuStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MenuStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
