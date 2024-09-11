import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavouritesCardComponent } from './favourites-card.component';

describe('FavouritesCardComponent', () => {
  let component: FavouritesCardComponent;
  let fixture: ComponentFixture<FavouritesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavouritesCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavouritesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
