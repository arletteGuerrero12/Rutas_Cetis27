import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { MainComponent } from '../main/main.component';
import { FooterComponent } from '../footer/footer.component';
import { MapsComponent } from '../maps/maps.component';
import { TableComponent } from '../table/table.component';
import { GraphicComponent } from '../graphic/graphic.component';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [
    HeaderComponent,
    MainComponent,
    FooterComponent,
    MapsComponent,
    TableComponent,
    GraphicComponent
  ],
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent {}