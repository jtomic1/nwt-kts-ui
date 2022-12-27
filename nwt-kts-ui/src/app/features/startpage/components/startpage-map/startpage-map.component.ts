import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { Subject, takeUntil } from 'rxjs';
import { MapService } from 'src/app/shared/services/map-service/map.service';
import { MessageService, MessageType } from 'src/app/shared/services/message-service/message.service';

@Component({
  selector: 'app-startpage-map',
  templateUrl: './startpage-map.component.html',
  styleUrls: ['./startpage-map.component.css']
})
export class StartpageMapComponent implements AfterViewInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  
  private map: any;
  private startMarker: any;
  isStartSet: boolean = false;
  private destinationMarker: any;
  isDestinationSet: boolean = false;
  private route: any;

  form: FormGroup = this.createFormGroup();

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
    
    this.map.on('click',  (e: {latlng: any}) => {
      if (!this.isStartSet) {
        this.setStartingMarker(e.latlng, true);
      } else if (!this.isDestinationSet) {
        this.setDestinationMarker(e.latlng, true);

        this.map.removeLayer(this.startMarker);
        this.map.removeLayer(this.destinationMarker);

        this.makeRoute();      
      }
    });
    
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      start: new FormControl(''),
      destination: new FormControl(''),
      price: new FormControl(''),
      time: new FormControl('')
    });
  }

  setStartingMarker(latlng: any, setAddress: boolean): void {
    this.startMarker = L.marker([latlng.lat, latlng.lng], {draggable: true});
    this.startMarker.addTo(this.map);
    this.isStartSet = true;
      
    if (setAddress) {
      this.mapService
        .getAddress(latlng)
        .pipe(takeUntil(this.destroy$))
        .subscribe((result: any) => {      
          var data = result.features[0].properties.geocoding;
          this.setStartFormControl(data);
        }
      );
    }
  }

  setDestinationMarker(latlng: any, setAddress: boolean): void {
    this.destinationMarker = L.marker([latlng.lat, latlng.lng], {draggable: true});
    this.destinationMarker.addTo(this.map);
    this.isDestinationSet = true;
        
    if (setAddress) {
      this.mapService
        .getAddress(latlng)
        .pipe(takeUntil(this.destroy$))
        .subscribe((result: any) => {
          var data = result.features[0].properties.geocoding;
          this.setDestinationFormControl(data);
        }
      );
    }
  }

  onStartSearch(): void {
    this.mapService
      .getCoordinates(this.form.controls['start'].value + ', Novi Sad')
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: any) => {                
        if (result.features.length !== 0) {
          if (!this.isStartSet) {
            var latlng = {lat: result.features[0].geometry.coordinates[1],
                          lng: result.features[0].geometry.coordinates[0]};
            this.setStartingMarker(latlng , false);
          } else {
            var destination = [this.route.getWaypoints()[1].latLng.lat, this.route.getWaypoints()[1].latLng.lng]
            this.route.setWaypoints([
            L.latLng([result.features[0].geometry.coordinates[1], result.features[0].geometry.coordinates[0]]),
            L.latLng([destination[0], destination[1]])
          ]);
          }
        } else {
          this.messageService.showMessage('Pretraga neuspešna!', MessageType.ERROR);
        }
      });
  }

  onDestinationSearch(): void {
    this.mapService
      .getCoordinates(this.form.controls['destination'].value + ', Novi Sad')
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: any) => {
        if (result.features.length !== 0) {
          if (!this.isDestinationSet) {
            var latlng = {lat: result.features[0].geometry.coordinates[1],
                          lng: result.features[0].geometry.coordinates[0]};
            this.setDestinationMarker(latlng, false);
  
            this.map.removeLayer(this.startMarker);
            this.map.removeLayer(this.destinationMarker);
  
            this.makeRoute();
          } else {
            var start = [this.route.getWaypoints()[0].latLng.lat, this.route.getWaypoints()[0].latLng.lng]
            this.route.setWaypoints([
              L.latLng([start[0], start[1]]),
              L.latLng([result.features[0].geometry.coordinates[1], result.features[0].geometry.coordinates[0]])
            ]);
          }
        } else {
          this.messageService.showMessage('Pretraga neuspešna!', MessageType.ERROR);
        }
      }
    );
  }

  makeRoute(): void {
    this.route = L.Routing.control({
      waypoints: [
        L.latLng(this.startMarker.getLatLng()),
        L.latLng(this.destinationMarker.getLatLng())
      ],
      addWaypoints: false,
      showAlternatives: true,
      altLineOptions: {
        styles: [
          {color: 'black', opacity: 0.15, weight: 9},
          {color: 'white', opacity: 0.8, weight: 6},
          {color: 'blue', opacity: 0.5, weight: 2}
        ],
        extendToWaypoints: false,
        missingRouteTolerance: 0
      }
    }).on('routesfound',  (e) => {      
      this.mapService
        .getAddress(e.waypoints[0].latLng)
        .pipe(takeUntil(this.destroy$))
        .subscribe((result: any) => {          
          var data = result.features[0].properties.geocoding;
          this.setStartFormControl(data);
        });
      this.mapService
        .getAddress(e.waypoints[1].latLng)
        .pipe(takeUntil(this.destroy$))
        .subscribe((result: any) => {
          var data = result.features[0].properties.geocoding;
          this.setDestinationFormControl(data);
        });
      this.form.controls['time'].setValue(Math.round(e.routes[0].summary.totalTime / 60) + ' minuta');
      this.form.controls['price'].setValue(Math.round(250 + (e.routes[0].summary.totalDistance / 1000)*120) + ' dinara');
    })
    .on('routeselected', (e) => {
      this.form.controls['time'].setValue(Math.round(e.route.summary.totalTime / 60) + ' minuta');
      this.form.controls['price'].setValue(Math.round(250 + (e.route.summary.totalDistance / 1000)*120) + ' dinara');
    })
    .addTo(this.map);

    this.route.hide();
  }

  setStartFormControl(data: any): void {
    if (data.housenumber !== undefined && data.street !== undefined) {
      this.form.controls['start'].setValue(data.street + ' ' + data.housenumber);
    }            
    else if (data.housenumber === undefined && data.street !== undefined) {
      this.form.controls['start'].setValue(data.street);
    } else {
      this.form.controls['start'].setValue(data.label);
    }
  }

  setDestinationFormControl(data: any): void {
    if (data.housenumber !== undefined && data.street !== undefined) {
      this.form.controls['destination'].setValue(data.street + ' ' + data.housenumber);
    }            
    else if (data.housenumber === undefined && data.street !== undefined) {
      this.form.controls['destination'].setValue(data.street);
    } else {
      this.form.controls['destination'].setValue(data.label);
    }
  }
}
