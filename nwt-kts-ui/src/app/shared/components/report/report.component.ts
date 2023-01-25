import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Chart, registerables  } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Subject, takeUntil } from 'rxjs';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { ReportType } from '../../models/enums/ReportType';
import { Report } from '../../models/Report';
import { User } from '../../models/User';
import { MessageService, MessageType } from '../../services/message-service/message.service';
import { ReportService } from '../../services/report-service/report.service';
import { UserService } from '../../services/user-service/user.service';
Chart.register(...registerables);

interface SelectOptions {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  reportType: ReportType = ReportType.ONE_CLIENT;
  userId: number = 0;

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  max = new Date();

  ridesPerDayChart!: Chart;
  ridesPerDayData: object[] = [];
  kilometersPerDayChart!: Chart;
  kilometersPerDayData: object[] = [];
  moneyPerDayChart!: Chart;
  moneyPerDayData: object[] = [];

  sumOfRides: number = 0;
  sumOfKilometers: number = 0;
  sumOfMoney: number = 0;

  averageRidesPerDay: number = 0;
  averageKilometersPerDay: number = 0;
  averageMoneyPerDay: number = 0;

  showData: boolean = false;

  selectedValue!: SelectOptions;
  options: SelectOptions[] = [];
  isAdminLogged: boolean = false;

  constructor(private messageService: MessageService,
              private reportService: ReportService,
              private loginService: LoginService,
              private userService: UserService) { }
  
  
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    if (this.loginService.user?.role === 'ROLE_USER') {
      this.reportType = ReportType.ONE_CLIENT;
      this.userId = this.loginService.user.id;
    } else if (this.loginService.user?.role === 'ROLE_DRIVER') {
      this.reportType = ReportType.ONE_DRIVER;
      this.userId = this.loginService.user.id;
    } else if (this.loginService.user?.role === 'ROLE_ADMIN') {
      this.isAdminLogged = true;
      this.loadUsers();
    }
  }

  generateReport() {
    if (this.isRangeValid()) { 
      if (this.isAdminLogged) {
        if (this.selectedValue !== undefined) {
          this.setUserAndType();
        } else {
          this.messageService.showMessage('Korisnik nije izabran!', MessageType.ERROR);
          return;
        }
      }      
      this.restartAllData();  
      this.reportService.getReports(this.getReport())
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: any) => {          
          for (const date in res.ridesPerDay) {
            this.ridesPerDayData.push({x: date, y: res.ridesPerDay[date]});
            this.sumOfRides += res.ridesPerDay[date];
          }
          for (const date in res.kilometersPerDay) {
            this.kilometersPerDayData.push({x: date, y: res.kilometersPerDay[date]});
            this.sumOfKilometers += res.kilometersPerDay[date];
          }
          for (const date in res.moneyPerDay) {
            this.moneyPerDayData.push({x: date, y: res.moneyPerDay[date] })
            this.sumOfMoney += res.moneyPerDay[date];
          }
          this.averageRidesPerDay = this.sumOfRides/this.ridesPerDayData.length;
          this.averageKilometersPerDay = this.sumOfKilometers/this.kilometersPerDayData.length;
          this.averageMoneyPerDay = this.sumOfMoney/this.moneyPerDayData.length;
          this.renderCharts();
          this.showData = true;
        });
    } else {
      this.messageService.showMessage('Opseg datuma nije ispravno unesen!', MessageType.ERROR);
    }
  }

  isRangeValid(): boolean {
    if (this.range.controls['start'].value !== null && this.range.controls['end'].value !== null) {
      return true;
    }
    return false;
  }

  setUserAndType() {
    console.log(this.selectedValue);
    if (this.selectedValue.name === 'Svi klijenti') {
      this.reportType = ReportType.ALL_CLIENTS;
    } else if (this.selectedValue.name === 'Svi vozači') {
      this.reportType = ReportType.ALL_DRIVERS;
    } else if (this.selectedValue.role === 'ROLE_USER') {
      this.reportType = ReportType.ONE_CLIENT;
      this.userId = this.selectedValue.id;
    } else if (this.selectedValue.role === 'ROLE_DRIVER') {
      this.reportType = ReportType.ONE_DRIVER;
      this.userId = this.selectedValue.id;
    }
  }

  restartAllData() {
    this.showData = false;
    this.ridesPerDayData = [];
    this.kilometersPerDayData = [];
    this.moneyPerDayData = [];
    this.sumOfRides = 0;
    this.sumOfKilometers = 0;
    this.sumOfMoney = 0;
    this.averageRidesPerDay = 0;
    this.averageKilometersPerDay = 0;
    this.averageMoneyPerDay = 0;
  }

  getReport(): Report {
    var report: Report = {
      reportType: this.reportType,
      userId: this.userId,
      start: this.range.controls['start'].value.toString(),
      end: this.range.controls['end'].value.toString()
    }; 
    return report;
  }

  loadUsers() {
    this.userService.getClientsAndDrivers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: User[]) => {
          this.options.push({id: 0, name: 'Svi klijenti', surname: '', email:'', role:''});
          this.options.push({id: 0, name: 'Svi vozači', surname: '', email:'', role:''});
          for (let user of res) {
            this.options.push({id: user.id, name: user.name, surname: user.lastName, email: user.email, role: user.roleString});
          }

        },
        error: (err) => {
          console.log(err.error.message);
        }
      });
  }

  renderCharts() {
    this.renderRidesPerDayChart();
    this.renderKilometersPerDayChart();
    this.renderMoneyPerDayChart();
  }

  renderRidesPerDayChart() {
    if (this.ridesPerDayChart !== undefined) {      
      this.ridesPerDayChart.destroy();
    }   
    const data = {      
      datasets: [{
        label: 'Broj vožnji po danu',
        data: this.ridesPerDayData,        
        borderWidth: 1
      }]
    };

    this.ridesPerDayChart = new Chart('ridesPerDay', {
      type: 'bar',
      data: data,
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                  quarter: 'MMM YYYY'
              }
            }
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  renderKilometersPerDayChart() {
    if (this.kilometersPerDayChart !== undefined) {
      this.kilometersPerDayChart.destroy();
    }   
    const data = {      
      datasets: [{
        label: 'Broj pređenih kilometara po danu',
        data: this.kilometersPerDayData,        
        borderWidth: 1
      }]
    };

    this.kilometersPerDayChart = new Chart('kilometersPerDay', {
      type: 'bar',
      data: data,
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                  quarter: 'MMM YYYY'
              }
            }
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  renderMoneyPerDayChart() {
    if (this.moneyPerDayChart !== undefined) {
      this.moneyPerDayChart.destroy();
    }    
    var label = '';
    if (this.reportType == ReportType.ALL_CLIENTS || this.reportType == ReportType.ONE_CLIENT) {
      label = 'Potrošen novac po danu';
    } else {
      label = 'Zarađen novac po danu';
    }
    const data = {      
      datasets: [{
        label: label,
        data: this.moneyPerDayData,        
        borderWidth: 1
      }]
    };

    this.moneyPerDayChart = new Chart('moneyPerDay', {
      type: 'bar',
      data: data,
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                  quarter: 'MMM YYYY'
              }
            }
          },
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
