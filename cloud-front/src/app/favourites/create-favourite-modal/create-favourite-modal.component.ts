import { Component, ElementRef, Input, ViewChild } from '@angular/core';

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
  
  constructor() { }

  openModal() {
    const modal = new bootstrap.Modal(this.dialogElement.nativeElement);
    modal.show();
  }

  onConfirm(): void {
    this.closeModal();
  }

  onCancel(): void {
    this.closeModal();
  }

  closeModal(): void {
    const modal = new bootstrap.Modal(this.dialogElement.nativeElement);
    modal.hide();
  }
}
