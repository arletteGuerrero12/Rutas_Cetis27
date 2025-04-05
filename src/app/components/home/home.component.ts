import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { MainComponent } from '../main/main.component';
import { FooterComponent } from '../footer/footer.component';
import { MapsComponent } from '../maps/maps.component';
import { TableComponent } from '../table/table.component';
import { GraphicComponent } from '../graphic/graphic.component';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    MainComponent,
    HttpClientModule,
    FooterComponent,
    MapsComponent,
    TableComponent,
    GraphicComponent
  ],
  templateUrl: './home.component.html', // Ahora enlazas el archivo HTML
  styleUrls: ['./home.component.css']
})
export class HomeComponent {}
