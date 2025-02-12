import { Component , ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent {
  @ViewChild('tableContainer', { static: true }) tableContainer?: ElementRef;

  constructor() {}

  

}


