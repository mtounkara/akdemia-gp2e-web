import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientsComponent } from './views/clients/clients.component';
import { InsertClientComponent } from './views/clients/insert-client/insert-client.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  ConfirmBoxConfigModule,
  NgxAwesomePopupModule,
} from '@costlydeveloper/ngx-awesome-popup';
import { LoginComponent } from './public/login/login.component';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { SubthemesComponent } from './views/subthemes/subthemes/subthemes.component';
import { FormationsComponent } from './views/formations/formations.component';

import { FormateursComponent } from './views/formateurs/formateurs.component';

import { FormationsInfosComponent } from './views/formations/formations-infos/formations-infos.component';
import { SessionsComponent } from './views/sessions/sessions.component';

@NgModule({
  declarations: [
    AppComponent,
    ClientsComponent,
    InsertClientComponent,
    LoginComponent,
    SubthemesComponent,
    FormationsComponent,
    FormationsInfosComponent,
    SessionsComponent,
    FormateursComponent,
    FormationsInfosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    NgSelectModule,
    ToastrModule.forRoot(),
    NgxAwesomePopupModule.forRoot(),
    ConfirmBoxConfigModule.forRoot(),
    FormsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
