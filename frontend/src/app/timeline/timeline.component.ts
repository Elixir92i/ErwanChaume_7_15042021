import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PostMedia } from '../models/post-media.model';
import { PostMessage } from '../models/post-message.model';
import { User } from '../models/user.model';
import { Subscription } from 'rxjs';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})

export class TimelineComponent implements OnInit {

  postSub: Subscription;
  mediaForm: FormGroup;
  messageForm: FormGroup;
  postMediaOrMessage = false;
  loading: boolean;
  messages: PostMessage[];
  medias: PostMedia[];
  errorMsg: string;
  imagePreview: string;
  animal: string;
  name: string;

  constructor(private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private post: PostService,
    private auth: AuthService,
    public dialog: MatDialog) { }

  ngOnInit() {
    this.postSub = this.post.medias$.subscribe(
      (medias) => {
        this.medias = medias;
        this.loading = false;
        this.errorMsg = null;
      },
      (error) => {
        this.errorMsg = JSON.stringify(error);
        this.loading = false;
      }
    );
    this.post.getMedias();
    this.initEmptyFormMedia();

    this.loading = true;
    this.postSub = this.post.messages$.subscribe(
      (messages) => {
        this.messages = messages;
        this.loading = false;
        this.errorMsg = null;
      },
      (error) => {
        this.errorMsg = JSON.stringify(error);
        this.loading = false;
      }
    )
    this.post.getMessages();
    this.initEmptyFormMessage();
  }

  onClickMedia(media_id: string) {
    this.router.navigate(['timeline/', media_id]);
  }
  onClickMessage(message_id: string) {
    this.router.navigate(['timeline/', message_id]);
  }

  initEmptyFormMedia() {
    this.mediaForm = this.formBuilder.group({
      title: [null, Validators.required],
      image: [null, Validators.required],
    });
  }

  initEmptyFormMessage() {
    this.messageForm = this.formBuilder.group({
      content: [null, Validators.required]
    });
  }
  onMedia() {
    this.loading = true;
    const newMedia = new PostMedia();
    newMedia.title = this.mediaForm.get('title').value;
    newMedia.user_id = this.auth.getUserId();

    this.post.createMedia(newMedia, this.mediaForm.get('image').value).then(
      (response: { message: string }) => {
        console.log(response.message);
        this.loading = false;
        this.router.navigate(['/timeline']);
      }
    ).catch(
      (error) => {
        console.error(error);
        this.loading = false;
        this.errorMsg = error.message;
      }
    );
  }
  onMessage() {
    this.loading = true;
    const newMessage = new PostMessage();
    newMessage.content = this.messageForm.get('content').value;
    newMessage.user_id = this.auth.getUserId();

    this.post.createMessage(newMessage).then(
      (response: { message: string }) => {
        console.log(response.message);
        this.loading = false;
        this.router.navigate(['/timeline']);
      }
    ).catch(
      (error) => {
        console.error(error);
        this.loading = false;
        this.errorMsg = error.message;
      }
    );
  }

  onFileAdded(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.mediaForm.get('image').setValue(file);
    this.mediaForm.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}


export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
})
export class DialogOverviewExample {

  animal: string;
  name: string;

  constructor(public dialog: MatDialog) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

}