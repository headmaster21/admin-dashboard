import { NgModule } from '@angular/core';

import { BackgroundColorDirective, ColorDirective, BorderColorDirective } from './color.directive';

@NgModule({
    exports: [BackgroundColorDirective, BorderColorDirective, ColorDirective],
    declarations: [BackgroundColorDirective, BorderColorDirective, ColorDirective]
})
export class ColorModule {}
