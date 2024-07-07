import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-film-view',
  standalone: true,
  imports: [],
  templateUrl: './film-view.component.html',
  styleUrl: './film-view.component.css'
})
export class FilmViewComponent {
  @Input() film: any = null;
  @Output() download = new EventEmitter();

}
