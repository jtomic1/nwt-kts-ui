import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ConnectableObservable, Subject, takeUntil } from 'rxjs';
import { OnWayStation } from '../../model/OnWayStation';
import { MatChipInputEvent } from '@angular/material/chips';
import { MapService } from 'src/app/shared/services/map-service/map.service';
import {
  MessageService,
  MessageType,
} from 'src/app/shared/services/message-service/message.service';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { VehiclePriceService } from '../../services/vehicle-price-service/vehicle-price.service';
import { Ride } from 'src/app/shared/models/Ride';
import { RideService } from '../../services/ride-service/ride.service';
import { environment } from 'src/environments/environment';
import { DriverService } from 'src/app/shared/services/driver-service/driver.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RideRequestDialogComponent } from '../clientpage-dialogs/ride-request-dialog/ride-request-dialog.component';
import { DriverRideService } from 'src/app/features/driverpage/services/ride-service/driver-ride.service';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { TokensService } from 'src/app/shared/services/tokens-service/tokens.service';
import { OrderRideHelpService } from '../../services/order-ride-help/order-ride-help.service';
import { ReservationNotification } from 'src/app/shared/models/ReservationNotification';
import { MapComponent } from 'src/app/shared/components/map/map.component';
import { ScheduleService } from 'src/app/shared/services/schedule-service/schedule.service';

const io = require('socket.io-client');

@Component({
  selector: 'app-clientpage-map',
  templateUrl: './clientpage-map.component.html',
  styleUrls: ['./clientpage-map.component.css'],
})
export class ClientpageMapComponent
  implements AfterViewInit, OnInit, OnDestroy
{
  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild(MapComponent) map!: MapComponent;

  form: FormGroup = this.createFormGroup();

  startCoord!: L.LatLng;
  onWayStationsLatLng: L.LatLng[] = [];
  endCoord!: L.LatLng;

  start: any;
  end: any;
  price!: string;
  time!: string;

  //private map: any;
  //private route: any;

  isStartSet: boolean = false;
  isDestinationSet: boolean = false;

  panelOpenState: boolean = false;

  addOnBlur = false;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  onWayStations: OnWayStation[] = [];
  splitFare: string[] = [];

  private vehicleType: number = 0;
  private vehiclePrice: number = 250;
  private routeLength: number = 0;
  tokenPrice: number = 0;

  socket: any;
  dialogRideOrderProcess: MatDialogRef<RideRequestDialogComponent> | undefined;
  coordinatesForSimulation: Array<number[]> = [];
  rideIsGoing: boolean = false;
  rideForChild!: Ride;

  orderText: string = 'Poruči vožnju';
  schedulingRide: boolean = false;
  selectedStartTime: string = '123';
  startTime: Date = new Date();
  endTime: Date = new Date();

  constructor(
    private mapService: MapService,
    private vehiclePriceService: VehiclePriceService,
    private rideSerice: RideService,
    private messageService: MessageService,
    private driverService: DriverService,
    private driverRideService: DriverRideService,
    public dialog: MatDialog,
    private logInService: LoginService,
    private tokenService: TokensService,
    private orderRideHelpService: OrderRideHelpService,
    private cdr: ChangeDetectorRef,
    private scheduleService: ScheduleService
  ) {}

  ngOnInit(): void {
    if (this.scheduleService.mapData !== null) {
      this.startCoord = this.scheduleService.mapData.startCoord;
      this.endCoord = this.scheduleService.mapData.endCoord;
      this.onWayStationsLatLng = this.scheduleService.mapData.onWayStations;
      for (let station of this.onWayStationsLatLng) {
        this.mapService
          .getAddress({ lat: station.lat, lng: station.lng })
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: any) => {
            let geoCodingData = res.features[0].properties.geocoding;
            let streetName =
              geoCodingData.street + ' ' + geoCodingData.housenumber;
            this.onWayStations.push({
              lat: station.lat,
              lng: station.lng,
              address: streetName,
            });
          });
      }
      this.scheduleService.reset();
      this.cdr.detectChanges();
      this.map.centerView();
      this.map.setStartingMarker();
      this.map.setDestinationMarker();
      this.map.addOnWayStations();
    }
  }

  ngAfterViewInit(): void {
    this.setUpSocket();
    this.checkIsClientInRide();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      start: new FormControl(''),
      destination: new FormControl(''),
      price: new FormControl(''),
      time: new FormControl(''),
      selectedStartTime: new FormControl(''),
    });
  }

  setPriceFormControl(distance: number): void {
    this.price =
      Math.round(this.vehiclePrice + (distance / 1000) * 120) + ' dinara';
    this.tokenPrice = Math.round(this.vehiclePrice / 10 + distance / 1000);
    this.form.controls['price'].setValue(this.price);
  }

  setTimeFormControl(time: number): void {
    this.time = Math.round(time / 60) + ' minuta';
    this.form.controls['time'].setValue(this.time);
  }

  updateStartFormControl(latlng: L.LatLng) {
    this.mapService
      .getAddress(latlng)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: any) => {
        this.start = result.features[0].properties.geocoding;
        this.isStartSet = true;
        this.setStartFormControl(this.start);
      });
  }

  updateEndFormControl(latlng: L.LatLng) {
    this.mapService
      .getAddress(latlng)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: any) => {
        this.end = result.features[0].properties.geocoding;
        this.isDestinationSet = true;
        this.setDestinationFormControl(this.end);
      });
  }

  checkIsClientInRide() {
    this.rideSerice.isClientInRide(this.logInService.user!.id).subscribe({
      next: (res: boolean) => {
        if (res) {
          this.rideIsGoing = true;
        }
      },
    });
  }

  setUpSocket() {
    this.socket = io(environment.chatSocketEndpoint);
    this.socket.emit('join', this.logInService.user!.id);
    this.socket.on('clinetInRide', (ride: Ride) => {
      console.log(ride);
      this.rideIsGoing = true;
      this.rideForChild = ride;
    });
    this.socket.on('driverStopRide', (data: any) => {
      this.messageService.showMessage(
        'Vozač je prekinuo vožnju.',
        MessageType.INFO
      );
      this.rideIsGoing = false;
    });

    this.socket.on(
      'notification-reservation',
      (res: ReservationNotification) => {
        this.messageService.showMessage(res.message, MessageType.INFO);
      }
    );
  }

  onStartSearch(): void {
    if (this.form.controls['start'].value === '') {
      this.messageService.showMessage(
        'Unesite naziv ulice!',
        MessageType.WARNING
      );
    } else {
      this.mapService
        .getCoordinates(this.form.controls['start'].value + ', Novi Sad')
        .pipe(takeUntil(this.destroy$))
        .subscribe((result: any) => {
          if (result.features.length !== 0) {
            var latlng = {
              lat: result.features[0].geometry.coordinates[1],
              lng: result.features[0].geometry.coordinates[0],
            };
            this.startCoord = L.latLng(latlng.lat, latlng.lng);
            this.cdr.detectChanges();
            this.map.setStartingMarker();
          } else {
            this.messageService.showMessage(
              'Pretraga neuspešna!',
              MessageType.ERROR
            );
          }
        });
    }
  }

  onDestinationSearch(): void {
    if (this.form.controls['destination'].value === '') {
      this.messageService.showMessage(
        'Unesite naziv ulice!',
        MessageType.WARNING
      );
    } else {
      this.mapService
        .getCoordinates(this.form.controls['destination'].value + ', Novi Sad')
        .pipe(takeUntil(this.destroy$))
        .subscribe((result: any) => {
          if (result.features.length !== 0) {
            var latlng = {
              lat: result.features[0].geometry.coordinates[1],
              lng: result.features[0].geometry.coordinates[0],
            };
            this.endCoord = L.latLng(latlng.lat, latlng.lng);
            this.cdr.detectChanges();
            this.map.setDestinationMarker();
          } else {
            this.messageService.showMessage(
              'Pretraga neuspešna!',
              MessageType.ERROR
            );
          }
        });
    }
  }

  setCoordsForSimulation(coordinates: any) {
    this.coordinatesForSimulation.splice(0);
    coordinates.forEach((coord: any) => {
      this.coordinatesForSimulation.push([coord.lat, coord.lng]);
    });
  }

  setOnWayStations(coordinates: L.LatLng[]) {
    if (coordinates.length > this.onWayStationsLatLng.length) {
      this.onWayStations = [];
      this.onWayStationsLatLng = [];
      coordinates.forEach((coord: L.LatLng, index) => {
        this.onWayStationsLatLng.push(coord);
        this.mapService
          .getAddress(coord)
          .pipe(takeUntil(this.destroy$))
          .subscribe((result: any) => {
            var data = result.features[0].properties.geocoding;
            if (data.housenumber !== undefined && data.street !== undefined) {
              let station: OnWayStation = {
                address: data.street + ' ' + data.housenumber,
                lat: coord.lat,
                lng: coord.lng,
              };
              this.onWayStations.push(station);
            } else {
              let station: OnWayStation = {
                address: 'NN ' + index,
                lat: coord.lat,
                lng: coord.lng,
              };
              this.onWayStations.push(station);
            }
          });
      });
    }
  }

  removeStation(station: OnWayStation): void {
    const index = this.onWayStations.indexOf(station);
    if (index >= 0) {
      this.onWayStations.splice(index, 1);
      for (let i = 0; i < this.onWayStationsLatLng.length; i++) {
        if (
          station.lat === this.onWayStationsLatLng[i].lat &&
          station.lng === this.onWayStationsLatLng[i].lng
        ) {
          this.onWayStationsLatLng.splice(i, 1);
          this.cdr.detectChanges();
          this.map.removeOnWayStations();
          this.map.addOnWayStations();
        }
      }
    }
  }

  addStation(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    this.mapService
      .getCoordinates(event.value.trim() + ', Novi Sad')
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: any) => {
        if (
          result.features.length !== 0 &&
          this.isStartSet &&
          this.isDestinationSet
        ) {
          var station: OnWayStation = {
            address: value,
            lat: result.features[0].geometry.coordinates[1],
            lng: result.features[0].geometry.coordinates[0],
          };
          this.onWayStations.push(station);
          this.onWayStationsLatLng.push(L.latLng(station.lat, station.lng));
          this.cdr.detectChanges();
          this.map.removeOnWayStations();
          this.map.addOnWayStations();
        } else if (!this.isStartSet || !this.isDestinationSet) {
          this.messageService.showMessage(
            'Prvo unesite polazište i krajnju lokaciju!',
            MessageType.WARNING
          );
        } else {
          this.messageService.showMessage(
            'Neuspešno dodavanje međustanice!',
            MessageType.ERROR
          );
        }
      });

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
      this.form.controls['start'].setValue(
        data.street + ' ' + data.housenumber
      );
    } else if (data.housenumber === undefined && data.street !== undefined) {
      this.form.controls['start'].setValue(data.street);
    } else if (data.type === 'street') {
      this.form.controls['start'].setValue(data.name);
    } else {
      this.form.controls['start'].setValue(data.name);
    }
  }

  setDestinationFormControl(data: any): void {
    if (data.housenumber !== undefined && data.street !== undefined) {
      this.form.controls['destination'].setValue(
        data.street + ' ' + data.housenumber
      );
    } else if (data.housenumber === undefined && data.street !== undefined) {
      this.form.controls['destination'].setValue(data.street);
    } else if (data.type === 'street') {
      this.form.controls['destination'].setValue(data.name);
    } else {
      this.form.controls['destination'].setValue(data.name);
    }
  }

  onRadioButtonGroupChange(event: any) {
    this.vehicleType = event.value;
    this.vehiclePriceService
      .getVehiclePrice(event.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: any) => {
        this.vehiclePrice = result;
        if (this.routeLength !== 0) {
          this.form.controls['price'].setValue(
            Math.round(this.vehiclePrice + (this.routeLength / 1000) * 120) +
              ' dinara'
          );
        }
      });
  }
  //-=============================================================
  //==============================================================
  //==============================================================
  orderRide(): void {
    let duration = this.form.controls['time'].value.split(' ')[0];
    if (this.schedulingRide) {
      if (this.form.controls['selectedStartTime'].value == '') {
        this.messageService.showMessage(
          'Morate uneti vreme kada želite da rezervišete!',
          MessageType.ERROR
        );
        return;
      }
      let userInputTime = this.form.controls['selectedStartTime'].value;
      this.startTime =
        this.orderRideHelpService.getStartTimeForReservationRide(userInputTime);
      let hours = Math.abs(this.startTime.getTime() - Date.now()) / 36e5;
      console.log(this.startTime.toISOString());
      console.log(hours);
      if (hours > 5) {
        this.messageService.showMessage(
          'Ne možete da rezervišete vožnju preko 5 sati unapred!',
          MessageType.ERROR
        );
        return;
      }
    } else {
      this.startTime = new Date();
    }
    this.endTime = this.orderRideHelpService.getEndTime(
      this.startTime,
      duration
    );
    if (this.isStartSet && this.isDestinationSet) {
      let allStops: string = '';
      let waypoints: L.Routing.Waypoint[] = this.map.getWaypoints();
      allStops +=
        this.form.controls['start'].value +
        ',' +
        waypoints[0].latLng.lat +
        ',' +
        waypoints[0].latLng.lng +
        ';';
      for (let ii = 0; ii < this.onWayStations.length; ii++) {
        allStops +=
          this.onWayStations[ii].address +
          ',' +
          this.onWayStations[ii].lat +
          ',' +
          this.onWayStations[ii].lng +
          ';';
      }
      allStops +=
        this.form.controls['destination'].value +
        ',' +
        waypoints[waypoints.length - 1].latLng.lat +
        ',' +
        waypoints[waypoints.length - 1].latLng.lng;

      let ride: Ride = {
        rideId: undefined,
        driverId: undefined,
        vehiclePlateNumber: undefined,
        deniedDrivers: [],
        stops: allStops,
        splitFare: this.splitFare,
        vehicleType: this.vehicleType,
        price: this.tokenPrice,
        duration: duration,
        distance: this.routeLength,
        reservation: this.schedulingRide,
        clientId: this.logInService.user!.id,
        startTime: this.startTime.toISOString(),
        endTime: this.endTime.toISOString(),
        pathForRide: JSON.stringify(this.coordinatesForSimulation),
      };

      this.openDialogForOrderRideProcess();
      this.orderRideServer(ride);
    } else {
      this.messageService.showMessage(
        'Niste zadali početnu i krajnju lokaciju!',
        MessageType.ERROR
      );
    }
  }

  openDialogForOrderRideProcess() {
    this.dialogRideOrderProcess = this.dialog.open(RideRequestDialogComponent, {
      height: '80%',
      width: '70%',
    });
    this.dialogRideOrderProcess.componentInstance!.setMessage(
      'Slanje zahteva za vožnju'
    );
    if (this.schedulingRide)
      this.dialogRideOrderProcess.componentInstance!.setTitle(
        'Zahtev za rezervaciju vožnje'
      );
    else
      this.dialogRideOrderProcess.componentInstance!.setTitle(
        'Zahtev za vožnju'
      );
  }

  orderRideServer(ride: Ride) {
    if (ride.deniedDrivers.length >= 2) {
      this.messageService.showMessage(
        'Trenutno su sva vozila zauzeta molimo pokusajte kasnije. (vozaci odbijaju voznje)',
        MessageType.WARNING
      );
      this.dialogRideOrderProcess!.componentInstance.setMessage(
        'Trenutno ne možemo da vam pronađemo vožnju.'
      );
      this.dialogRideOrderProcess!.componentInstance.setCantFindRide();
      return;
    }
    this.dialogRideOrderProcess!.componentInstance.setMessage(
      'Traženje odgovarajućeg vozača...'
    );
    this.rideSerice
      .orderRide(ride)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.messageService.showMessage(res.toString(), MessageType.SUCCESS);
          this.getDriverForRide(ride);
        },
        error: (err) => {
          this.dialogRideOrderProcess!.componentInstance.setMessage(
            'Nismo uspeli da kreiramo zahtev :('
          );
          this.dialogRideOrderProcess!.componentInstance.cantFindRide = true;
          this.dialogRideOrderProcess!.close();
          this.messageService.showMessage(err.error.message, MessageType.ERROR);
        },
      });
  }

  getDriverForRide(ride: Ride) {
    this.rideSerice
      .getDriverForRide(ride)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.messageService.showMessage(
            'Pronašli smo vozača',
            MessageType.SUCCESS
          );
          this.dialogRideOrderProcess!.componentInstance.setMessage(
            'Vozač je pronađen čeka se njegova potvrda...'
          );
          console.log(res);
          ride.driverId = res.driverId;
          this.setUpSocketForDriverConformation(ride);
        },
        error: (err) => {
          this.dialogRideOrderProcess!.componentInstance.setMessage(
            'Trenutno nema slobodnih vozača :('
          );
          this.dialogRideOrderProcess!.componentInstance.cantFindRide = true;
          this.messageService.showMessage(err.error.message, MessageType.ERROR);
        },
      });
  }

  setUpSocketForDriverConformation(ride: Ride) {
    console.log('setting socket up for ride');
    console.log(ride);
    this.socket.on('acceptedRide', (data: any) => {
      ride.driverId = data.ride.driverId;
      ride.vehiclePlateNumber = data.ride.vehiclePlateNumber;
      this.dialogRideOrderProcess!.componentInstance.setMessage(
        'Uspešno smo vam pronašli vozača za vožnju.'
      );
      this.dialogRideOrderProcess!.componentInstance.finishProcess(ride);
    });

    this.socket.on('deniedRide', (data: any) => {
      this.messageService.showMessage(
        'Nažalost ovaj vozač je odbio. :(',
        MessageType.WARNING
      );
      let driverId = data.driverId;
      ride.deniedDrivers.push(driverId);
      this.orderRideServer(ride);
    });

    this.dialogRideOrderProcess!.afterClosed().subscribe((res) => {
      if (res === 'ACCEPTED') {
        this.clientAccepted(ride);
      } else {
        this.clientCanceled(ride);
      }
    });
  }

  clientAccepted(ride: Ride) {
    this.rideSerice
      .clinetConfirmRide(ride)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.tokenService.currentUserTokensChangedSubject.next('');
          this.messageService.showMessage(res, MessageType.SUCCESS);
          if (!this.schedulingRide) {
            // this.driverRideService.startRideDriveSimulation(this.coordinatesForSimulation,ride);
            this.rideForChild = ride;
            // this.rideIsGoing = true;
          }
        },
      });
  }

  clientCanceled(ride: Ride) {
    this.rideSerice.clientCancelRide(ride);
  }

  scheduleRide(): void {
    this.orderText = 'Zakaži vožnju ';
    this.schedulingRide = true;
  }

  cancelScheduleRide(): void {
    this.orderText = 'Poruči vožnju';
    this.schedulingRide = false;
  }
}
