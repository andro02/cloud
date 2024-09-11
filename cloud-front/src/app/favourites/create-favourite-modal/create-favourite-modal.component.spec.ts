import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFavouriteModalComponent } from './create-favourite-modal.component';

describe('CreateFavouriteModalComponent', () => {
  let component: CreateFavouriteModalComponent;
  let fixture: ComponentFixture<CreateFavouriteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateFavouriteModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFavouriteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
