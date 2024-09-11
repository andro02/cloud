import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilmsFavouritesComponent } from './films-favourites.component';

describe('FilmsFavouritesComponent', () => {
  let component: FilmsFavouritesComponent;
  let fixture: ComponentFixture<FilmsFavouritesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilmsFavouritesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilmsFavouritesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
