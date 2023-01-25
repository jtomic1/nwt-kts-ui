import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subject, takeUntil } from 'rxjs';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { FareService } from 'src/app/shared/services/fare-service/fare.service';
import { MessageService } from 'src/app/shared/services/message-service/message.service';
import { FareDTO } from '../../models/FareDTO';
import { FareHistoryDTO } from '../../models/FareHistoryDTO';

@Component({
  selector: 'app-fare-history',
  templateUrl: './fare-history.component.html',
  styleUrls: ['./fare-history.component.css'],
})
export class FareHistoryComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  count: number = 0;
  items: any[] = [];

  dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  displayedColumns: string[] = [
    'startTime',
    'startAddress',
    'endTime',
    'endAddress',
    'price',
  ];

  currentPage: number = 0;
  currentSort: string = 'startTime-desc';

  focusedFare: FareDTO | null = null;

  constructor(
    private fareService: FareService,
    private loginService: LoginService,
    private messageService: MessageService
  ) {}

  get clientId(): number {
    return this.loginService.user!.id;
  }

  ngOnInit(): void {
    this.fetchData(0);
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.fetchData(this.currentPage);
  }

  announceSortChange(event: Sort) {
    this.currentSort = `${event.active}-${event.direction}`;
    this.fetchData(0);
  }

  rowClick(row: FareDTO) {
    this.focusedFare = row;
  }

  fetchData(pageNumber: number) {
    this.fareService
      .getFaresByClient(this.clientId, pageNumber, this.currentSort)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: FareHistoryDTO) => {
          this.dataSource.data = res.fares;
          this.count = res.count;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
