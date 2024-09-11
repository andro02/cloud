import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-film-view',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './film-view.component.html',
  styleUrl: './film-view.component.css'
})

export class FilmViewComponent {
  @Input() film: any = null;
  @Output() download = new EventEmitter();

  constructor(public datePipe: DatePipe){};

}
