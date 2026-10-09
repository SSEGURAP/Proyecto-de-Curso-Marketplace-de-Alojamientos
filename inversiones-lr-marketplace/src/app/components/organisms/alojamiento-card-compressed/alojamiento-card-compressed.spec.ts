import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlojamientoCardCompressed } from './alojamiento-card-compressed';

describe('AlojamientoCardCompressed', () => {
  let component: AlojamientoCardCompressed;
  let fixture: ComponentFixture<AlojamientoCardCompressed>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlojamientoCardCompressed],
    }).compileComponents();

    fixture = TestBed.createComponent(AlojamientoCardCompressed);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
