import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBarHero } from './search-bar-hero';

describe('SearchBarHero', () => {
  let component: SearchBarHero;
  let fixture: ComponentFixture<SearchBarHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarHero],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarHero);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
