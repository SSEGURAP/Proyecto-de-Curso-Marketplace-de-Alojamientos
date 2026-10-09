import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturedAlojamientos } from './featured-alojamientos';

describe('FeaturedAlojamientos', () => {
  let component: FeaturedAlojamientos;
  let fixture: ComponentFixture<FeaturedAlojamientos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedAlojamientos],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturedAlojamientos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
