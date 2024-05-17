import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomProdcutSummaryComponent } from './custom-prodcut-summary.component';

describe('CustomProdcutSummaryComponent', () => {
  let component: CustomProdcutSummaryComponent;
  let fixture: ComponentFixture<CustomProdcutSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomProdcutSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomProdcutSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
