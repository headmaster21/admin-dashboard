import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { 
  BoxModule, 
  TabsModule, 
  DropdownModule,
  InputGroupModule, 
  AccordionModule as MkAccordionModule,
  AlertModule as MkAlertModule,
  BoxInfoModule as MkBoxInfoModule,
  BoxSmallModule as MkBoxSmallModule,
  DropdownModule as mkDropdownModule,
  InputTextModule as mkInputTextModule, 
  TabsModule as MkTabsModule
} from '../library';

const mods = [
  BoxModule, TabsModule, DropdownModule, InputGroupModule, MkAccordionModule, MkAlertModule, 
  MkBoxInfoModule, MkBoxSmallModule, mkDropdownModule, mkInputTextModule, MkTabsModule,
  FormsModule, ReactiveFormsModule 
];

@NgModule({
  declarations: [],
  imports: [ CommonModule, ...mods],
  exports: [ ...mods]
})
export class ComponetsModule { 
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ComponetsModule,
      providers: [
       // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
       // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
      ]
    };
  }
}
