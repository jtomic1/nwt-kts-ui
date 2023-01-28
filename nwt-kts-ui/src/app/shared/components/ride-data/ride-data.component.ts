import {  Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { MapService } from '../../services/map-service/map.service';
import { MessageService, MessageType } from '../../services/message-service/message.service';
import * as L from 'leaflet';

@Component({
  selector: 'app-ride-data',
  templateUrl: './ride-data.component.html',
  styleUrls: ['./ride-data.component.css']
})
export class RideDataComponent implements  OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() start: any = {};
  @Input() end: any = {};
  @Input() price!: string;
  @Input() time!: string;

  @Output() startSearched = new EventEmitter<L.LatLng>();
  @Output() endSearched = new EventEmitter<L.LatLng>();

  form: FormGroup = this.createFormGroup();

  constructor(private mapService: MapService,
              private messageService: MessageService,
              ) { }

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

  onStartSearch(): void {
    if (this.form.controls['start'].value === '') {
      this.messageService.showMessage('Unesite naziv ulice!', MessageType.WARNING);
    }
    else {
      this.mapService
        .getCoordinates(this.form.controls['start'].value + ', Novi Sad')
        .pipe(takeUntil(this.destroy$))
        .subscribe((result: any) => {                
          if (result.features.length !== 0) {
            var latlng = {lat: result.features[0].geometry.coordinates[1],
                          lng: result.features[0].geometry.coordinates[0]};
            this.startSearched.emit(L.latLng(latlng.lat, latlng.lng));                     
          } else {
            this.messageService.showMessage('Pretraga neuspešna!', MessageType.ERROR);
          }
        });
    }
  }

  onDestinationSearch(): void {
    if (this.form.controls['destination'].value === '') {
      this.messageService.showMessage('Unesite naziv ulice!', MessageType.WARNING);
    } else {
      this.mapService
        .getCoordinates(this.form.controls['destination'].value + ', Novi Sad')
        .pipe(takeUntil(this.destroy$))
        .subscribe((result: any) => {
          if (result.features.length !== 0) {           
            var latlng = {lat: result.features[0].geometry.coordinates[1],
                          lng: result.features[0].geometry.coordinates[0]};                                     
            this.endSearched.emit(L.latLng(latlng.lat, latlng.lng));                      
          } else {
            this.messageService.showMessage('Pretraga neuspešna!', MessageType.ERROR);
          }
      });
    }
  }

  setStartFormControl(): void {    
    if (this.start.housenumber !== undefined && this.start.street !== undefined) {
      this.form.controls['start'].setValue(this.start.street + ' ' + this.start.housenumber);
    }            
    else if (this.start.housenumber === undefined && this.start.street !== undefined) {
      this.form.controls['start'].setValue(this.start.street);
    } else if (this.start.type == "street") {
      this.form.controls['start'].setValue(this.start.name);
    } else {
      this.form.controls['start'].setValue(this.start.name);
    }
  }

  setDestinationFormControl(): void {    
    if (this.end.housenumber !== undefined && this.end.street !== undefined) {
      this.form.controls['destination'].setValue(this.end.street + ' ' + this.end.housenumber);
    }            
    else if (this.end.housenumber === undefined && this.end.street !== undefined) {
      this.form.controls['destination'].setValue(this.end.street);
    } else if (this.end.type == "street") {
      this.form.controls['destination'].setValue(this.end.name);
    } else {
      this.form.controls['destination'].setValue(this.end.name);
    }
  }

  setPriceFormControl(): void {
    this.form.controls['price'].setValue(this.price);
  }

  setTimeFormControl(): void {
    this.form.controls['time'].setValue(this.time);
  }
}
