import {  ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as L from 'leaflet';
// import 'leaflet-routing-machine';
import { Subject, takeUntil } from 'rxjs';
import { MapComponent } from 'src/app/shared/components/map/map.component';
import { RideDataComponent } from 'src/app/shared/components/ride-data/ride-data.component';
import { MapService } from 'src/app/shared/services/map-service/map.service';
import { MessageService, MessageType } from 'src/app/shared/services/message-service/message.service';

@Component({
  selector: 'app-startpage-map',
  templateUrl: './startpage-map.component.html',
  styleUrls: ['./startpage-map.component.css']
})
export class StartpageMapComponent implements  OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  
  @ViewChild(MapComponent) map!: MapComponent;
  @ViewChild(RideDataComponent) data: RideDataComponent = new RideDataComponent(this.mapService, this.messageService);

  startCoord!: L.LatLng;
  onWayStations!: L.LatLng[];
  endCoord!: L.LatLng;

  start: any;
  end: any;
  price!: string;
  time!: string;


  form: FormGroup = this.createFormGroup();

  constructor(private mapService: MapService,
              private messageService: MessageService,
              private cdr: ChangeDetectorRef) { }  

  
  
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      start: new FormControl(''),
      destination: new FormControl(''),
      price: new FormControl(''),
      time: new FormControl('')
    });
  }

  updateStartFormControl(latlng: L.LatLng) {
    this.mapService
        .getAddress(latlng)
        .pipe(takeUntil(this.destroy$))
        .subscribe((result: any) => {    
          this.start = result.features[0].properties.geocoding;
          this.cdr.detectChanges();
          this.data.setStartFormControl();
        });
  }

  updateEndFormControl(latlng: L.LatLng) {
    this.mapService
        .getAddress(latlng)
        .pipe(takeUntil(this.destroy$))
        .subscribe((result: any) => {
          this.end = result.features[0].properties.geocoding;
          this.cdr.detectChanges();
          this.data.setDestinationFormControl();
        });
  }

  setStartFormControl(data: any): void {
    this.start = data;
    this.cdr.detectChanges();
    this.data.setStartFormControl();
  }

  setDestinationFormControl(data: any): void {
    this.end = data;
    this.cdr.detectChanges();
    this.data.setDestinationFormControl();
  }

  setPriceFormControl(distance: number): void {
    this.price = Math.round(250 + (distance / 1000)*120) + ' dinara';
    this.cdr.detectChanges();
    this.data.setPriceFormControl();
  }

  setTimeFormControl(time: number): void {
    this.time = Math.round(time / 60) + ' minuta';
    this.cdr.detectChanges();
    this.data.setTimeFormControl();
  }

  OnStartSearched(latlng: L.LatLng): void {
    this.startCoord = latlng;
    this.cdr.detectChanges();
    this.map.setStartingMarker();   
  }

  OnEndSearched(latlng: L.LatLng): void {
    this.endCoord = latlng;
    this.cdr.detectChanges();
    this.map.setDestinationMarker();
  }
}
