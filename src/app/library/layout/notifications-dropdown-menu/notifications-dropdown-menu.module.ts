import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { NotificationsDropdownMenuComponent  } from './notifications-dropdown-menu.component';


@NgModule({
    imports: [CommonModule, RouterModule],
    exports: [NotificationsDropdownMenuComponent],
    declarations: [NotificationsDropdownMenuComponent]
})
export class NotificationsDropdownMenuModule { }
