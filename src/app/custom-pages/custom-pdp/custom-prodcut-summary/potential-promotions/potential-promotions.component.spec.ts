import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PotentialPromotionsComponent } from './potential-promotions.component';

describe('PotentialPromotionsComponent', () => {
  let component: PotentialPromotionsComponent;
  let fixture: ComponentFixture<PotentialPromotionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PotentialPromotionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PotentialPromotionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
