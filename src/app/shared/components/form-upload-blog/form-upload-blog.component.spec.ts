import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUploadBlogComponent } from './form-upload-blog.component';

describe('FormUploadBlogComponent', () => {
  let component: FormUploadBlogComponent;
  let fixture: ComponentFixture<FormUploadBlogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormUploadBlogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormUploadBlogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
