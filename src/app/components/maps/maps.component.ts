import { Component, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ComunicacionService } from '../../services/comunicacion.service';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { fromLonLat } from 'ol/proj';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style, Stroke, Fill } from 'ol/style';

@Component({
  selector: 'app-maps',
  standalone: true,  // Asegúrate de tener esto en true
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css']
})
export class MapsComponent implements AfterViewInit, OnInit {
  @ViewChild('mapElement', { static: false }) mapElement!: ElementRef;
  private map!: Map;
  private markerLayer!: VectorLayer<VectorSource>;
  private geojsonLayer!: VectorLayer<VectorSource>;
  public errorMessage: string = '';  
  public mensajeRecibido: string = ''; // Variable para almacenar el mensaje recibido

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, 
    private http: HttpClient,
    private comunicacionService: ComunicacionService // Inyectamos el servicio de comunicación
  ) {}

  ngOnInit(): void {
    // Suscribirse al servicio para recibir mensajes
    this.comunicacionService.obtenerMensaje().subscribe((mensaje) => {
      this.mensajeRecibido = mensaje;
      console.log('Mensaje recibido en Map:', this.mensajeRecibido);
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initMap();
    }
  }

  initMap(): void {
    const geojsonSource = new VectorSource({
      url: 'assets/imagine/estados.json',
      format: new GeoJSON()
    });

    this.geojsonLayer = new VectorLayer({
      source: geojsonSource,
      style: (feature) => {
        if (feature.get('CVE_ENT') === '16' ) {
          return new Style({
            stroke: new Stroke({
              color: '#FF0000',
              width: 2
            })
          });
        } else {
          return undefined;
        }
      }
    });

    const markerSource = new VectorSource();
    this.markerLayer = new VectorLayer({
      source: markerSource,
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'assets/imagine/location.png',
          scale: 1.2,
          color: '#ff0000'
        }),
        stroke: new Stroke({
          color: '#000000',
          width: 2
        })
      })
    });

    this.map = new Map({
      target: this.mapElement.nativeElement,
      layers: [
        new TileLayer({ source: new OSM() }),
        this.geojsonLayer,
        this.markerLayer
      ],
      view: new View({
        center: fromLonLat([-99.1332, 19.4326]),
        zoom: 6
      })
    });
  }

  searchAddress(address: string): void {
    const formattedAddress = this.formatAddress(address);
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(formattedAddress)}&key=14d1288818ee4320b066447af9108dc6`;
console.log(formattedAddress)
    this.http.get(url).subscribe((response: any) => {
      if (response.results.length > 0) {
        const location = response.results[0].geometry;
        this.addMarker(location.lng, location.lat);
        this.map.getView().setCenter(fromLonLat([location.lng, location.lat]));
        this.map.getView().setZoom(14);
        this.errorMessage = '';
      } else {
        this.errorMessage = 'Geocoding failed: No results found for the provided address.';
        console.error('Geocoding failed: No results found');
      }
    }, (error) => {
      this.errorMessage = 'An error occurred while trying to fetch geocoding data.';
      console.error('Geocoding error:', error);
    });
  }

  formatAddress(address: string): string {
    const parts = address.split(',');
    if (parts.length === 2) {
      const streetPart = parts[0].trim();
      const cityPart = parts[1].trim();
      const addressParts = cityPart.split(' ');
      const postalCode = addressParts.pop();
      const state = addressParts.pop();
      const city = addressParts.join(' ');

      const streetNameParts = streetPart.split(' ');
      const streetNumberIndex = streetNameParts.findIndex(part => !isNaN(Number(part)));
      const streetName = streetNameParts.slice(streetNumberIndex + 1).join(' ');

      return `${streetName},${city} ${state} Mexico ${postalCode}`.trim();
    }
    return address;
  }

  addMarker(lon: number, lat: number): void {
    const marker = new Feature({
      geometry: new Point(fromLonLat([lon, lat]))
    });
    this.markerLayer.getSource()?.addFeature(marker);
  }
}
