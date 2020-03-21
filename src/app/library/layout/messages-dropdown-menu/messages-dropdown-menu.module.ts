import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MessagesDropdownMenuComponent  } from './messages-dropdown-menu.component';


@NgModule({
    imports: [CommonModule, RouterModule],
    exports: [MessagesDropdownMenuComponent],
    declarations: [MessagesDropdownMenuComponent]
})
export class MessagesDropdownMenuModule { }
