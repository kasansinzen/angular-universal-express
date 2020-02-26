import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogTypeListComponent } from './blog-type-list.component';

describe('BlogTypeListComponent', () => {
  let component: BlogTypeListComponent;
  let fixture: ComponentFixture<BlogTypeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogTypeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
