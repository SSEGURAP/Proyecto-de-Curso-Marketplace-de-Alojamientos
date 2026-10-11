import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailGallery } from './detail-gallery';

describe('DetailGallery', () => {
  let component: DetailGallery;
  let fixture: ComponentFixture<DetailGallery>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailGallery],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailGallery);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
