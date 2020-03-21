import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { HeaderComponent, HeaderLogoComponent, HeaderLogoMiniComponent } from './header.component';
import { MessagesDropdownMenuModule } from '../messages-dropdown-menu/messages-dropdown-menu.module';
import { NotificationsDropdownMenuModule } from '../notifications-dropdown-menu/notifications-dropdown-menu.module';

@NgModule({
    imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, MessagesDropdownMenuModule, NotificationsDropdownMenuModule ],
    exports: [HeaderComponent, HeaderLogoComponent, HeaderLogoMiniComponent],
    declarations: [HeaderComponent, HeaderLogoComponent, HeaderLogoMiniComponent]
})
export class HeaderModule { }
