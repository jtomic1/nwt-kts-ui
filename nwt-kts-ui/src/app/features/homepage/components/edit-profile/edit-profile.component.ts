import { HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';
import { ResetPasswordComponent } from 'src/app/features/startpage/components/reset-password/reset-password.component';
import { LoginService } from 'src/app/features/startpage/services/login-service/login.service';
import { PersonalDataMode } from 'src/app/shared/components/personal-data/PersonalDataMode';
import { getAvatarClass, Role } from 'src/app/shared/models/enums/Role';
import { ImageUrlDTO } from 'src/app/shared/models/ImageUrlDTO';
import { User } from 'src/app/shared/models/User';
import { ImageService } from 'src/app/shared/services/image-service/image.service';
import {
  MessageService,
  MessageType,
} from 'src/app/shared/services/message-service/message.service';
import { UserService } from 'src/app/shared/services/user-service/user.service';
import { ChangeUserDataDTO } from '../../models/ChangeUserDataDTO';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent  {
  destroy$: Subject<boolean> = new Subject<boolean>();
  editForm: FormGroup;
  editFormCache: string = '';
  placeholder: string | null = null;

  @ViewChild('fileInput', { static: true }) fileInput!: ElementRef;

  constructor(
    private loginService: LoginService,
    private imageService: ImageService,
    private userService: UserService,
    private messageService: MessageService,
    private dialog: MatDialog
  ) {
    this.editForm = this.createEditForm(this.user);
    this.editFormCache = JSON.stringify(this.editForm.getRawValue());
  }


  get PersonalDataMode(): typeof PersonalDataMode {
    return PersonalDataMode;
  }

  get user(): User {
    return this.loginService.user!;
  }

  get uploadText(): string {
    if (this.placeholder === null) return 'PROMENI PROFILNU FOTOGRAFIJU';
    return 'UKLONI OTPREMLJENU FOTOGRAFIJU';
  }

  get enableUpdateButton(): boolean {
    return (
      (this.isFormChanged || this.placeholder !== null) && this.editForm.valid
    );
  }

  get isFormChanged(): boolean {
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
    if (this.placeholder === null) this.fileInput.nativeElement.click();
    else this.placeholder = null;
  }

  uploadFile() {
    const file = this.fileInput.nativeElement.files[0];
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
            this.placeholder = res.imageUrl;
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

  sendProfileDataChangeRequest(): void {
    let message: string;
    if (this.user.role === Role.DRIVER)
      message = 'Zahtev za promenu podataka uspešno poslat!';
    else message = 'Podaci su uspešno promenjeni';
    let dto: ChangeUserDataDTO = {
      name: this.editForm.value.name,
      lastName: this.editForm.value.lastName,
      phone: this.editForm.value.phoneNumber,
      town: this.editForm.value.town,
      photo: this.user.profilePhoto,
    };

    if (this.placeholder !== null) dto.photo = this.placeholder;

    this.userService
      .sendChangeUserDataRequest(dto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.placeholder = null;
          if (this.user.role !== Role.DRIVER) this.loginService.updateUser(dto);
          else this.editForm.patchValue(JSON.parse(this.editFormCache));
          this.messageService.showMessage(message, MessageType.SUCCESS);
        },
        error: (err) => {
          this.messageService.showMessage(err.error.message, MessageType.ERROR);
        },
      });
  }

  openPasswordResetDialog() {
    const dialogRef = this.dialog.open(ResetPasswordComponent);

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {});
  }
}
