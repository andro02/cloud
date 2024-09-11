import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { AxiosService } from '../../axios.service';

@Component({
  selector: 'app-create-favourite-modal',
  standalone: true,
  imports: [],
  templateUrl: './create-favourite-modal.component.html',
  styleUrl: './create-favourite-modal.component.css'
})
export class CreateFavouriteModalComponent {
  @ViewChild('createFavouriteModal', { static: true }) dialogElement!: ElementRef;
  @Input() name: String = '';

  private modal: any;
  
  constructor(private axiosService: AxiosService) { }

  openModal() {
    this.modal = new bootstrap.Modal(this.dialogElement.nativeElement);
    this.modal.show();
  }

  onConfirm(): void {
    const favouriteInformation = {
      'userEmail': this.axiosService.getEmail(),
      'name': this.name
    }
    
    this.axiosService.request(
      "POST",
      "/favourite",
      favouriteInformation,
      "application/json"
    ).then(
      response => {
        this.closeModal();
      }
    );
  }

  closeModal(): void {
    this.modal.hide();
  }
}
