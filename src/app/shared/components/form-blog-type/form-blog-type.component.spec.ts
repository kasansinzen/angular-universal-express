import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormBlogTypeComponent } from './form-blog-type.component';

describe('FormBlogTypeComponent', () => {
  let component: FormBlogTypeComponent;
  let fixture: ComponentFixture<FormBlogTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormBlogTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormBlogTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
