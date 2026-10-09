import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PhotoRating } from './photo-rating';

describe('PhotoRating', () => {
  let component: PhotoRating;
  let fixture: ComponentFixture<PhotoRating>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhotoRating],
    }).compileComponents();

    fixture = TestBed.createComponent(PhotoRating);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
