import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestForPodPopupComponent } from './request-for-pod-popup.component';

describe('RequestForPodPopupComponent', () => {
  let component: RequestForPodPopupComponent;
  let fixture: ComponentFixture<RequestForPodPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestForPodPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestForPodPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
