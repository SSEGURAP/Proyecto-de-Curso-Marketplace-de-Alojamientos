import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RangeField } from './range-field';

describe('RangeField', () => {
  let component: RangeField;
  let fixture: ComponentFixture<RangeField>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangeField],
    }).compileComponents();

    fixture = TestBed.createComponent(RangeField);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
