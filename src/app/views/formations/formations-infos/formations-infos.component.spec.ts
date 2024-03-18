import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormationsInfosComponent } from './formations-infos.component';

describe('FormationsInfosComponent', () => {
  let component: FormationsInfosComponent;
  let fixture: ComponentFixture<FormationsInfosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormationsInfosComponent]
    });
    fixture = TestBed.createComponent(FormationsInfosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
