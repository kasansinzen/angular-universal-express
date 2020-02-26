import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProductTypeComponent } from './form-product-type.component';

describe('FormProductTypeComponent', () => {
  let component: FormProductTypeComponent;
  let fixture: ComponentFixture<FormProductTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormProductTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormProductTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
