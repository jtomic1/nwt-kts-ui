import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Subject } from 'rxjs';
import { OnWayStation } from '../../model/OnWayStation';
import { MatChipInputEvent } from '@angular/material/chips';
import { MapService } from 'src/app/shared/services/map-service/map.service';
import { MessageService } from 'src/app/shared/services/message-service/message.service';
import * as L from 'leaflet';
import 'leaflet-routing-machine';

@Component({
  selector: 'app-clientpage-map',
  templateUrl: './clientpage-map.component.html',
  styleUrls: ['./clientpage-map.component.css']
})
export class ClientpageMapComponent implements AfterViewInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  
  form: FormGroup = this.createFormGroup();

  private map: any;
  private route: any;

  private startMarker: any;
  isStartSet: boolean = false;
  private destinationMarker: any;
  isDestinationSet: boolean = false;

  panelOpenState: boolean = false;

  addOnBlur = false;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  onWayStations: OnWayStation[] = [];
  splitFare: string[] = [];

  constructor(private mapService: MapService,
              private messageService: MessageService) { }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
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

    var taxiFreeIcon = L.icon({
      iconUrl: 'assets/taxi-free.png',
      iconSize: [32, 32]
    });
    var markerTaxiFree = L.marker([45.249602, 19.849632], {icon: taxiFreeIcon})
                          .bindPopup('Vozilo je slobodno.');
    
    markerTaxiFree.addTo(this.map);

    var taxiTakenIcon = L.icon({
      iconUrl: 'assets/taxi-taken.png',
      iconSize: [32, 32]
    });
    var markerTaxiTaken = L.marker([45.253534, 19.840869], {icon: taxiTakenIcon})
                           .bindPopup('Vozilo je zauzeto.');
    
    markerTaxiTaken.addTo(this.map);
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      start: new FormControl(''),
      destination: new FormControl(''),
      price: new FormControl(''),
      time: new FormControl('')
    });
  }

  onStartSearch(): void {

  }

  onDestinationSearch(): void {

  }

  removeStation(station: OnWayStation): void {

  }

  addStation(event: MatChipInputEvent): void {
    
  }

  removeEmail(email: string): void {

  }

  addEmail(event: MatChipInputEvent): void {

  }

}
