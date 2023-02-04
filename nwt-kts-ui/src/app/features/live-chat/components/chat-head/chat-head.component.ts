import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Role } from 'src/app/shared/models/enums/Role';
import { User } from 'src/app/shared/models/User';
import { UserService } from 'src/app/shared/services/user-service/user.service';

@Component({
  selector: 'app-chat-head',
  templateUrl: './chat-head.component.html',
  styleUrls: ['./chat-head.component.css'],
})
export class ChatHeadComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Output() clickedChatHead = new EventEmitter<User>();

  @Input() userId: number = -1;

  unreadMessage: boolean = false;

  public activeChat: boolean = false;

  user: User = {
    id: 0,
    email: '',
    name: '',
    lastName: '',
    active: false,
    blocked: false,
    phone: '',
    username: '',
    role: Role.USER,
    roleString: '',
    town: '',
    profilePhoto: '',
  };

  @Input()
  lastMessage: string = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService
      .getUser(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.user = data;
      });
  }

  chatHeadClicked() {
    this.activeChat = true;
    this.unreadMessage = false;
    this.clickedChatHead.emit(this.user);
  }

  newMessage(messageContent: string) {
    this.lastMessage = messageContent;
  }

  newMessageAnimation() {
    this.unreadMessage = true;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
