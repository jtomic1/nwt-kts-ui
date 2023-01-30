import {
  AfterViewInit,
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
} from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { DriverService } from '../../services/driver-service/driver.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  @Input() addWaypoints: boolean = false;
  @Input() startCoord!: L.LatLng;
  @Input() onWayStations: L.LatLng[] = [];
  @Input() endCoord!: L.LatLng;
  @Input() mapInDialog: boolean = false;
  @Input() displayDrivers: boolean = false;

  @Output() startChanged = new EventEmitter<L.LatLng>();
  @Output() endChanged = new EventEmitter<L.LatLng>();
  @Output() priceChanged = new EventEmitter<number>();
  @Output() timeChanged = new EventEmitter<number>();
  @Output() simCoordsChanged = new EventEmitter<any>();
  @Output() wayStationsAdded = new EventEmitter<L.LatLng[]>();

  @ViewChild('mapDiv', { static: false }) mapDiv!: ElementRef;

  private map: any;
  private startMarker: any;
  isStartSet: boolean = false;
  private destinationMarker: any;
  isDestinationSet: boolean = false;
  private route: any;

  constructor(private driverService: DriverService) {}

  ngAfterViewInit(): void {
    L.Icon.Default.imagePath = 'assets/leaflet/';
    this.initMap();
    if (this.displayDrivers) {
      this.driverService.setMap(this.map);
    }
  }

  private initMap(): void {
    if (this.mapInDialog) {
      this.map = undefined;
    }
    this.map = L.map('map').setView(
      [45.255351359492444, 19.84542310237885],
      14
    );

    var default_map = L.tileLayer(
      'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    );
    default_map.addTo(this.map);
    var dark_map = L.tileLayer(
      'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 20,
        attribution:
          '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
      }
    );
    var satellite_map = L.tileLayer(
      'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }
    );

    var baseMaps = {
      OpenStreetMap: default_map,
      'Dark mode': dark_map,
      Satellite: satellite_map,
    };

    L.control.layers(baseMaps).addTo(this.map);

    this.map.on('click', (e: { latlng: any }) => {
      if (!this.isStartSet) {
        this.startCoord = e.latlng;
        this.setStartingMarker();
        this.startChanged.emit(e.latlng);
      } else if (!this.isDestinationSet) {
        this.endCoord = e.latlng;
        this.endChanged.emit(e.latlng);
        this.setDestinationMarker();
      }
    });
  }

  setStartingMarker(): void {
    if (!this.isStartSet) {
      this.startMarker = L.marker([this.startCoord.lat, this.startCoord.lng], {
        draggable: true,
      });
      this.startMarker.addTo(this.map);
      this.isStartSet = true;
    } else {
      var destination = [
        this.route.getWaypoints()[this.route.getWaypoints().length - 1].latLng
          .lat,
        this.route.getWaypoints()[this.route.getWaypoints().length - 1].latLng
          .lng,
      ];
      this.route.setWaypoints([
        L.latLng(this.startCoord.lat, this.startCoord.lng),
        L.latLng(destination[0], destination[1]),
      ]);
    }
  }

  setDestinationMarker(): void {
    if (!this.isDestinationSet) {
      this.destinationMarker = L.marker(
        [this.endCoord.lat, this.endCoord.lng],
        { draggable: true }
      );
      this.destinationMarker.addTo(this.map);
      this.isDestinationSet = true;
      this.makeRoute();
    } else {
      var start = [
        this.route.getWaypoints()[0].latLng.lat,
        this.route.getWaypoints()[0].latLng.lng,
      ];
      this.route.setWaypoints([
        L.latLng(start[0], start[1]),
        L.latLng(this.endCoord.lat, this.endCoord.lng),
      ]);
    }
  }

  addOnWayStations(): void {
    for (let latlng of this.onWayStations) {
      this.route.spliceWaypoints(
        this.route.getWaypoints().length - 1,
        0,
        latlng
      );
    }
  }

  removeOnWayStations(): void {
    while (this.route.getWaypoints().length > 2) {
      this.route.spliceWaypoints(this.route.getWaypoints().length - 2, 1);
    }
  }

  makeRoute(): void {
    this.map.removeLayer(this.startMarker);
    this.map.removeLayer(this.destinationMarker);
    this.route = L.Routing.control({
      waypoints: [this.startCoord, this.endCoord],
      //draggableWaypoints: false,
      addWaypoints: this.addWaypoints,
      showAlternatives: true,
      altLineOptions: {
        styles: [
          { color: 'black', opacity: 0.15, weight: 9 },
          { color: 'white', opacity: 0.8, weight: 6 },
          { color: 'blue', opacity: 0.5, weight: 2 },
        ],
        extendToWaypoints: false,
        missingRouteTolerance: 0,
      },
    })
      .on('routesfound', (e) => {
        this.simCoordsChanged.emit(e.routes[0].coordinates);
        this.startChanged.emit(e.waypoints[0].latLng);
        this.endChanged.emit(e.waypoints[e.waypoints.length - 1].latLng);
        this.priceChanged.emit(e.routes[0].summary.totalDistance);
        this.timeChanged.emit(e.routes[0].summary.totalTime);
      })
      .on('routeselected', (e) => {
        this.simCoordsChanged.emit(e.route.coordinates);
        this.priceChanged.emit(e.route.summary.totalDistance);
        this.timeChanged.emit(e.route.summary.totalTime);
      })
      .on('waypointschanged', (e) => {
        this.addStationWithMarkerDrag(e.waypoints);
      })
      .addTo(this.map);

    this.route.hide();
  }

  addStationWithMarkerDrag(waypoints: any) {
    var coords: L.LatLng[] = [];
    for (let i = 1; i < waypoints.length - 1; i++) {
      coords.push(waypoints[i].latLng);
    }
    this.wayStationsAdded.emit(coords);
  }

  centerView() {
    this.map.setView(
      [
        (this.startCoord.lat + this.endCoord.lat) / 2,
        (this.startCoord.lng + this.endCoord.lng) / 2,
      ],
      13
    );
  }

  getWaypoints(): L.Routing.Waypoint[] {
    return this.route.getWaypoints();
  }
}
