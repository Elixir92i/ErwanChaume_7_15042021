import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { ProfileUpdateComponent, DeleteAccountDialog } from './profile-update/profile-update.component';
import { TimelineComponent, PostMessageDialog, PostMediaDialog } from './timeline/timeline.component';
import {MatNativeDateModule} from '@angular/material/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {DemoMaterialModule} from './material-module';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import { SinglePostComponent } from './single-post/single-post.component';
import { NgxPaginationModule } from 'ngx-pagination';




@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LoginComponent,
    UserProfileComponent,
    ProfileUpdateComponent,
    TimelineComponent,
    PostMessageDialog,
    PostMediaDialog,
    SinglePostComponent,
    DeleteAccountDialog
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DemoMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    NgxPaginationModule,
  ],
  entryComponents: [TimelineComponent, PostMessageDialog, PostMediaDialog, ],
  providers: [{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } },
  {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},],
  bootstrap: [AppComponent]
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
