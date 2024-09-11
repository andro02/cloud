import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmsFavouritesCardComponent } from './films-favourites-card.component';

describe('FilmsFavouritesCardComponent', () => {
  let component: FilmsFavouritesCardComponent;
  let fixture: ComponentFixture<FilmsFavouritesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilmsFavouritesCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilmsFavouritesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
