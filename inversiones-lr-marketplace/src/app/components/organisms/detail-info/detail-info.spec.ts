import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailInfo } from './detail-info';

describe('DetailInfo', () => {
  let component: DetailInfo;
  let fixture: ComponentFixture<DetailInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailInfo],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailInfo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
