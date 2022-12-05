import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-startpage-map',
  templateUrl: './startpage-map.component.html',
  styleUrls: ['./startpage-map.component.css']
})
export class StartpageMapComponent implements AfterViewInit {

  private map: any;

  constructor() { }

  ngAfterViewInit(): void {
  this.initMap(); 
  }

  private initMap(): void {
    this.map = L.map('map').setView([45.255351359492444, 19.84542310237885], 15);

    var default_map = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { 
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    default_map.addTo(this.map);
    var dark_map = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    });
    var satellite_map = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
      maxZoom: 20,
      subdomains:['mt0','mt1','mt2','mt3']
    });

    var baseMaps = {
      "OpenStreetMap": default_map,
      "Dark mode": dark_map,
      "Satellite": satellite_map  
    };
    
    L.control.layers(baseMaps).addTo(this.map);

    
    
  }
}
