import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { concatMap, Subject, takeUntil } from 'rxjs';
import { AdminService } from 'src/app/shared/services/admin-service/admin.service';
import {
  MessageService,
  MessageType,
} from 'src/app/shared/services/message-service/message.service';
import { ChangeRequestDTO } from '../../../models/ChangeRequestDTO';

@Component({
  selector: 'app-driver-change-list',
  templateUrl: './driver-change-list.component.html',
  styleUrls: ['./driver-change-list.component.css'],
})
export class DriverChangeListComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  count: number = 0;
  items: ChangeRequestDTO[] = [];

  currentPage: number = 0;

  constructor(
    private adminService: AdminService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.adminService
      .getAllChangeRequests(0)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: { count: number; res: ChangeRequestDTO[] }) => {
          this.count = res.count;
          this.items = res.res;
        },
      });
  }

  approveChangeRequest(index: number) {
    this.adminService
      .approveChangeRequest(this.items[index].id)
      .pipe(
        concatMap(() =>
          this.adminService.getAllChangeRequests(this.currentPage)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res: { count: number; res: ChangeRequestDTO[] }) => {
          this.count = res.count;
          this.items = res.res;
          this.messageService.showMessage(
            'Zahtev uspešno odobren!',
            MessageType.SUCCESS
          );
        },
      });
  }

  denyChangeRequest(index: number) {
    this.adminService
      .denyChangeRequest(this.items[index].id)
      .pipe(
        concatMap(() =>
          this.adminService.getAllChangeRequests(this.currentPage)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res: { count: number; res: ChangeRequestDTO[] }) => {
          this.count = res.count;
          this.items = res.res;
          this.messageService.showMessage(
            'Zahtev uspešno uklonjen!',
            MessageType.SUCCESS
          );
        },
      });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.adminService
      .getAllChangeRequests(event.pageIndex)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: { count: number; res: ChangeRequestDTO[] }) => {
          this.items = res.res;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
