import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Subject, takeUntil } from 'rxjs';
import { OnWayStation } from '../../model/OnWayStation';
import { MatChipInputEvent } from '@angular/material/chips';
import { MapService } from 'src/app/shared/services/map-service/map.service';
import { MessageService, MessageType } from 'src/app/shared/services/message-service/message.service';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { VehiclePriceService } from '../../services/vehicle-price-service/vehicle-price.service';
import { Ride } from 'src/app/shared/models/Ride';
import { RideService } from '../../services/ride-service/ride.service';
import { environment } from 'src/environments/environment';
import { DriverService } from 'src/app/shared/services/driver-service/driver.service';
import { DriverStatus } from 'src/app/shared/models/enums/DriverStatus';
import { NewPositionsForDriver } from 'src/app/shared/models/NewPositionsForDriver';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RideRequestDialogComponent } from '../clientpage-dialogs/ride-request-dialog/ride-request-dialog.component';

const io = require('socket.io-client');

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

  private vehicleType: number = 0;
  private vehiclePrice: number = 250;
  private routeLength: number = 0;
  
  socket: any;
  taxiPositions: Map<string,L.Marker> = new Map<string,L.Marker>();
  dialogRideOrderProcess: MatDialogRef<RideRequestDialogComponent> | undefined;
  coordinatesForSimulation: Array<number[]> = [];
  
  taxiFreeIcon = L.icon({
    iconUrl: 'assets/taxi-free.png',
    iconSize: [32, 32]
  });
  
  taxiUnavailableIcon = L.icon({
    iconUrl: 'assets/taxi-unavailable.png',
    iconSize: [32, 32]
  });

  taxiInRideIcon = L.icon({
    iconUrl: 'assets/taxi-ride.png',
    iconSize: [32, 32]
  });

  
  constructor(private mapService: MapService,
              private vehiclePriceService: VehiclePriceService,
              private rideSerice: RideService,
              private messageService: MessageService,
              private driverService: DriverService,
              public dialog: MatDialog) { }

  ngAfterViewInit(): void {
    
    this.initMap();
    this.setTaxiDriversOnMap();
    this.setUpSocket();
    

    
  }

  private setTaxiDriversOnMap(){
    this.driverService.getAllDrivers()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (drivers) =>{
          drivers.forEach( (driver) =>{
              let markerForDriver = L.marker([driver.positionLatitude,driver.positionLongitude]);
              if(driver.driverStatus == DriverStatus.AVAILABLE){
                markerForDriver.setIcon(this.taxiFreeIcon);
                markerForDriver.bindPopup("Vozilo je slobodno");
              }
              else if( driver.driverStatus == DriverStatus.UNAVAILABLE){
                markerForDriver.bindPopup("Vozilo nije dostupno");
                markerForDriver.setIcon(this.taxiUnavailableIcon);
              }
              else if (driver.driverStatus == DriverStatus.DRIVING){
                markerForDriver.bindPopup("Vozilo u voznji!");
                markerForDriver.setIcon(this.taxiInRideIcon);
              }
              // markerForDriver.addTo(this.map);
              this.taxiPositions.set( driver.vehiclePlateNumber, markerForDriver);
              this.taxiPositions.get(driver.vehiclePlateNumber)?.addTo(this.map);
              console.log("dodat taxi!");
              console.log(driver.vehiclePlateNumber);
          })
        }
      );
  }
  private setUpSocket(){

    this.socket = io(environment.chatSocketEndpoint);
    this.socket.on("newPositionForDriver", (data:NewPositionsForDriver)=>{
      console.log(data);
      this.taxiPositions.get(data.plateNumber)?.setLatLng([data.newPosition[0],data.newPosition[1]]);
    })
    console.log("socket is set up!")
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private initMap(): void {
    this.map = L.map('map').setView([45.255351359492444, 19.84542310237885], 13);
    
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


    this.map.on('click',  (e: {latlng: any}) => {
      if (!this.isStartSet) {
        this.setStartingMarker(e.latlng, true);
      } else if (!this.isDestinationSet) {
        this.setDestinationMarker(e.latlng, true);

        this.map.removeLayer(this.startMarker);
        this.map.removeLayer(this.destinationMarker);

        this.makeRoute();
      }
      for (let i = 1; i <= 10; i++) {
        setTimeout(() => {
            let latLng = this.taxiPositions.get("TAXI_ID_1")?.getLatLng();

            this.taxiPositions.get("TAXI_ID_1")?.setLatLng([latLng?.lat!+0.001, latLng?.lng!+0.0001])
        }, 1000 * i);
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

  onStartSearch(): void {
    if (this.form.controls['start'].value === '') {
      this.messageService.showMessage('Unesite naziv ulice!', MessageType.WARNING);
    } else {
      this.mapService.getCoordinates(this.form.controls['start'].value + ', Novi Sad')
        .pipe(takeUntil(this.destroy$))
        .subscribe((result: any) => {       
          if (result.features.length !== 0) {
            if (!this.isStartSet) {
              var latlng = {lat: result.features[0].geometry.coordinates[1],
                            lng: result.features[0].geometry.coordinates[0]};
              this.setStartingMarker(latlng , false);
            } else {
              var destination = [this.route.getWaypoints()[this.route.getWaypoints().length - 1].latLng.lat, this.route.getWaypoints()[this.route.getWaypoints().length - 1].latLng.lng]
              this.route.setWaypoints([
              L.latLng([result.features[0].geometry.coordinates[1], result.features[0].geometry.coordinates[0]]),
              L.latLng([destination[0], destination[1]])
            ]);
            }
          } else {
            this.messageService.showMessage('Pretraga neuspešna!', MessageType.ERROR);
          }
        }    
      );
    }
  }

  onDestinationSearch(): void {
    if (this.form.controls['destination'].value === '') {
      this.messageService.showMessage('Unesite naziv ulice!', MessageType.WARNING);
    } else {
      this.mapService.getCoordinates(this.form.controls['destination'].value + ', Novi Sad')
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
  }

  setStartingMarker(latlng: any, setAddress: boolean): void {
    this.startMarker = L.marker([latlng.lat, latlng.lng], {draggable: true});
    this.startMarker.addTo(this.map);
    this.isStartSet = true;
      
    if (setAddress) {
      this.mapService.getAddress(latlng)
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
      this.mapService.getAddress(latlng)
        .pipe(takeUntil(this.destroy$))
        .subscribe((result: any) => {
          var data = result.features[0].properties.geocoding;
          this.setDestinationFormControl(data);
        }
      );
    }
  }

  makeRoute(): void {
    this.route = L.Routing.control({
      waypoints: [
        L.latLng(this.startMarker.getLatLng()),
        L.latLng(this.destinationMarker.getLatLng())
      ],            
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
      console.log(e);
      e.routes[0].coordinates.forEach((cord:any)=>{
        this.coordinatesForSimulation.push( [ cord.lat , cord.lng]);
        // console.log(`[ ${cord.lat}, ${cord.lng} ],`)
      })
      console.log(this.coordinatesForSimulation);
      this.mapService.getAddress(e.waypoints[0].latLng)
        .pipe(takeUntil(this.destroy$))
        .subscribe((result: any) => {        
          var data = result.features[0].properties.geocoding;
          this.setStartFormControl(data);
        }
      );
      this.mapService.getAddress(e.waypoints[e.waypoints.length - 1].latLng)
        .pipe(takeUntil(this.destroy$))
        .subscribe((result: any) => {
          var data = result.features[0].properties.geocoding;
          this.setDestinationFormControl(data);
        }        
      );
      this.form.controls['time'].setValue(Math.round(e.routes[0].summary.totalTime / 60) + ' minuta');
      this.routeLength = e.routes[0].summary.totalDistance;
      this.form.controls['price'].setValue(Math.round(this.vehiclePrice + (this.routeLength / 1000)*120) + ' dinara');
    })
    .on('routeselected', (e) => {
      e.route.coordinates.forEach((cord:any)=>{
        this.coordinatesForSimulation.push( [ cord.lat , cord.lng]);
        // console.log(`[ ${cord.lat}, ${cord.lng} ],`)
      })
      console.log(this.coordinatesForSimulation);
      this.form.controls['time'].setValue(Math.round(e.route.summary.totalTime / 60) + ' minuta');
      this.routeLength = e.route.summary.totalDistance;
      this.form.controls['price'].setValue(Math.round(this.vehiclePrice + (this.routeLength / 1000)*120) + ' dinara');
    })
    .on('waypointschanged',  (e) => {      
      this.addStationWithMarkerDrag(e.waypoints);
    })
    .addTo(this.map);

    this.route.hide();
  }

  removeStation(station: OnWayStation): void {
    const index = this.onWayStations.indexOf(station);
    if (index >= 0) {
      this.onWayStations.splice(index, 1);      
      var waypoints: L.Routing.Waypoint[] = this.route.getWaypoints();
      for (let i = 0; i < waypoints.length; i++) {
        if (station.lat === waypoints[i].latLng.lat && station.lng === waypoints[i].latLng.lng) {
          this.route.spliceWaypoints(i, 1);
        }
      }
    }
  }

  addStation(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    this.mapService.getCoordinates((event.value).trim() + ', Novi Sad')
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: any) => {
        if (result.features.length !== 0 && this.isStartSet && this.isDestinationSet) {                             
          var station: OnWayStation = {address: value, lat: result.features[0].geometry.coordinates[1],
                                        lng: result.features[0].geometry.coordinates[0]};
          this.onWayStations.push(station);  
          this.route.spliceWaypoints(this.route.getWaypoints().length - 1, 0, L.latLng([station.lat, station.lng]));    
        } 
        else if (!this.isStartSet || !this.isDestinationSet) {
          this.messageService.showMessage('Prvo unesite polazište i krajnju lokaciju!', MessageType.WARNING);
        } else {
          this.messageService.showMessage('Neuspešno dodavanje međustanice!', MessageType.ERROR);
        }
      }    
    );
    
    event.chipInput!.clear();
  }

  removeEmail(email: string): void {
    const index = this.splitFare.indexOf(email);

    if (index >= 0) {
      this.splitFare.splice(index, 1);
    }
  }

  addEmail(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.splitFare.push(value);
    }
    event.chipInput!.clear();
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

  addStationWithMarkerDrag(waypoints: any) {
    this.onWayStations = [];
    for (let i = 1; i < waypoints.length - 1; i++) {
      this.mapService.getAddress(waypoints[i].latLng)
        .pipe(takeUntil(this.destroy$))
        .subscribe((result: any) => {
          var data = result.features[0].properties.geocoding;
          if (data.housenumber !== undefined && data.street !== undefined) {
            var station: OnWayStation = {address: data.street + ' ' + data.housenumber, lat: waypoints[i].latLng.lat, lng: waypoints[i].latLng.lng};
            this.onWayStations.push(station);
          } 
          else {
            var station: OnWayStation = {address: 'NN ' + i, lat: waypoints[i].latLng.lat, lng: waypoints[i].latLng.lng};
            this.onWayStations.push(station);
          }
        }
      );
    }
  }

  onRadioButtonGroupChange(event: any) { 
    this.vehicleType = event.value;   
    this.vehiclePriceService.getVehiclePrice(event.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: any) => {
        this.vehiclePrice = result;
        if (this.routeLength !== 0) {
          this.form.controls['price'].setValue(Math.round(this.vehiclePrice + (this.routeLength / 1000)*120) + ' dinara');
        }
      }
    );
  }

  orderRide(): void {
    if (this.isStartSet && this.isDestinationSet) {

      var allStops: String = '';
      var waypoints: L.Routing.Waypoint[] = this.route.getWaypoints();
      allStops += this.form.controls['start'].value+','+waypoints[0].latLng.lat+','+waypoints[0].latLng.lng+';';
      for (let ii = 0; ii < this.onWayStations.length; ii++) {        
        allStops += this.onWayStations[ii].address+','+this.onWayStations[ii].lat+','+this.onWayStations[ii].lng+';';
      }
      allStops += this.form.controls['destination'].value+','+waypoints[waypoints.length-1].latLng.lat+','+waypoints[waypoints.length-1].latLng.lng;
      var ride: Ride = {
        stops: allStops,
        splitFare: this.splitFare,
        vehicleType: this.vehicleType,
        price: this.form.controls['price'].value.split(' ')[0],
        duration: this.form.controls['time'].value.split(' ')[0],
                        distance: this.routeLength,
        isReservation: false,
        rideId: undefined,
        driverId: undefined,
        vehiclePlateNumber: undefined
      };
    
      this.openDialogForOrderRideProcess();
      this.orderRideServer(ride);

    } else {
      this.messageService.showMessage('Niste zadali početnu i krajnju lokaciju!', MessageType.ERROR);
    }
  }

  openDialogForOrderRideProcess(){
    this.dialogRideOrderProcess = this.dialog.open(RideRequestDialogComponent,
      {
        data :{message:" Slanje zahteva za voznju... "},
        height: '80%',
        width: '70%',
      }
    );
  }

  orderRideServer(ride:Ride){
    this.rideSerice.orderRide(ride)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.messageService.showMessage(res.toString(), MessageType.SUCCESS);
        this.dialogRideOrderProcess!.componentInstance.setMessage("Traženje odgovarajućeg vozača...")

        this.getDriverForRide(ride);
      },
      error: (err) => {
        this.dialogRideOrderProcess!.componentInstance.setMessage("Nismo uspeli da kreiramo zahtev :(")
        this.messageService.showMessage(err.error.message, MessageType.ERROR);
      }
    });
  }

  getDriverForRide(ride:Ride){
    this.rideSerice.getDriverForRide(ride)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.messageService.showMessage("Pronašli smo vozača", MessageType.SUCCESS);
        this.dialogRideOrderProcess!.componentInstance.setMessage("Vozač je pronađen čeka se njegova potvrda...");
        console.log(res);
        ride.rideId = res.rideId;
        this.setUpSocketForDriverConformation(ride);
      },
      error: (err) => {
        this.dialogRideOrderProcess!.componentInstance.setMessage("Nismo uspeli da kreiramo zahtev :(")
        this.messageService.showMessage(err.error.message, MessageType.ERROR);

      }
    }
    )
  }

  setUpSocketForDriverConformation(ride:Ride){
    console.log("setting socket up for ride");
    console.log(ride);
    this.socket.emit("join",ride.rideId);
    this.socket.on("acceptedRide" ,(data :any) =>{
      ride.driverId = data.ride.driverId;
      ride.vehiclePlateNumber = data.ride.vehiclePlateNumber;
      this.dialogRideOrderProcess!.componentInstance.setMessage("Uspešno ste naručili taxi, vozač je krenu po vas.");
      this.dialogRideOrderProcess!.componentInstance.finishProcess();
      this.driverService.startRideDriveSimulation(this.coordinatesForSimulation,ride);
    });
  }

  scheduleRide(): void {

  }

}
