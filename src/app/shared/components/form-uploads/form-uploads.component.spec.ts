import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormUploadsComponent } from './form-uploads.component';

describe('FormUploadsComponent', () => {
  let component: FormUploadsComponent;
  let fixture: ComponentFixture<FormUploadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormUploadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormUploadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
