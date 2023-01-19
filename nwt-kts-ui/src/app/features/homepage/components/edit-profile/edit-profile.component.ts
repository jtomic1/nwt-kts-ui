import { HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { PersonalDataMode } from 'src/app/shared/components/personal-data/PersonalDataMode';
import { getAvatarClass } from 'src/app/shared/models/enums/Role';
import { ImageUrlDTO } from 'src/app/shared/models/ImageUrlDTO';
import { User } from 'src/app/shared/models/User';
import { ImageService } from 'src/app/shared/services/image-service/image.service';
import {
  MessageService,
  MessageType,
} from 'src/app/shared/services/message-service/message.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  editForm: FormGroup;
  editFormCache: string = '';

  @ViewChild('fileInput', { static: true }) fileInput!: ElementRef;

  constructor(
    private loginService: LoginService,
    private imageService: ImageService,
    private messageService: MessageService
  ) {
    this.editForm = this.createEditForm(this.user);
    this.editFormCache = JSON.stringify(this.editForm.getRawValue());
  }

  ngOnInit(): void {}

  get PersonalDataMode(): typeof PersonalDataMode {
    return PersonalDataMode;
  }

  get roleClass(): string {
    return getAvatarClass(this.user.role);
  }

  get user(): User {
    return this.loginService.user!;
  }

  get enableUpdateButton(): boolean {
    return (
      JSON.stringify(this.editForm.getRawValue()).toLowerCase() !==
      this.editFormCache.toLowerCase()
    );
  }

  createEditForm(user: User): FormGroup {
    return new FormGroup({
      email: new FormControl({ value: user.email, disabled: true }),
      name: new FormControl(user.name),
      lastName: new FormControl(user.lastName),
      town: new FormControl(user.town),
      phoneNumber: new FormControl(
        user.phone,
        Validators.pattern('^[0-9]{9,12}$')
      ),
    });
  }

  openFileInput() {
    this.fileInput.nativeElement.click();
  }

  // Method to handle the uploaded file
  uploadFile() {
    const file = this.fileInput.nativeElement.files[0];
    console.log(typeof file);
    if (file.size > 5 * 1024 * 1024) {
      this.messageService.showMessage(
        'Fotografija je prevelika!',
        MessageType.ERROR
      );
      return;
    } else {
      this.imageService
        .sendImageRequest(file)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res: ImageUrlDTO) => {
            this.loginService.updateUserPhoto(res.imageUrl);
            this.messageService.showMessage(
              'Fotografija uspešno promenjena!',
              MessageType.SUCCESS
            );
          },
          error: (err) => {
            this.messageService.showMessage(
              err.error.message,
              MessageType.ERROR
            );
          },
        });
    }
  }
}
