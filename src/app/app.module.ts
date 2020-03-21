import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {LocationStrategy, Location, PathLocationStrategy} from '@angular/common';

import { adminLteConf } from './admin-lte.conf';
import { LayoutModule } from './library';
import { CoreModule } from './core/core.module';

import { SharedModule } from './shared.module';
import { LoadingPageModule, MaterialBarModule } from 'angular-loading-page';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule.forRoot(),
    LayoutModule.forRoot(adminLteConf),
    LoadingPageModule, MaterialBarModule
  ],
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }

