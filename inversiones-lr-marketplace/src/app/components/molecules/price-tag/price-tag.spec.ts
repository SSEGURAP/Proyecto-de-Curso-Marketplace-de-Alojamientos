import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PriceTag } from './price-tag';

describe('PriceTag', () => {
  let component: PriceTag;
  let fixture: ComponentFixture<PriceTag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceTag],
    }).compileComponents();

    fixture = TestBed.createComponent(PriceTag);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
