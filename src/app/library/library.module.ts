import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccordionModule } from './accordion/accordion.module';
import { AlertModule } from './alert/alert.module';

const comp = [
  AccordionModule
];

const serv = [

];

@NgModule({  
  imports: [ CommonModule, ...comp],
  exports: [ ...comp],
  entryComponents: [,...comp],
  declarations: []
})
export class LibraryModule { 
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: LibraryModule,
      providers: [
      ]
    };
  }
}
