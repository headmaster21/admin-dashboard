import { Directive, Input, Renderer2, ElementRef } from '@angular/core';

import { ColorService } from './color.service';

@Directive({ selector: '[mkBackgroudColor]',  providers: [ColorService] })
export class BackgroundColorDirective {
  /**
   * @method constructor
   * @param elementRef   [description]
   * @param renderer2    [description]
   * @param colorService [description]
   */
  constructor( private elementRef: ElementRef, private renderer2: Renderer2, private colorService: ColorService ) {}

  @Input('mkBackgroundPrefix')          prefix   : string;
  @Input('mkBackgroundOutline')         outline  : string;
  @Input('mkBackgroundIsSolid')         issolid  : string;
  @Input('mkBackgroundColorCondition')  condition: string;  

  @Input('mkBackgroudColor') set color(color: string) {  
    let out = this.outline == "true" ? true : false;
    let sol = this.issolid == "true" ? true : false;


    let con = this.condition == "true" ? true : false;
    if( con ){ this.colorService.setBackgroundColor(color, this.prefix, out, sol); }
  }
}


@Directive({ selector: '[mkBorderColor]',  providers: [ColorService] })
export class BorderColorDirective {
  /**
   * @method constructor
   * @param elementRef   [description]
   * @param renderer2    [description]
   * @param colorService [description]
   */
  constructor( private elementRef: ElementRef, private renderer2: Renderer2, private colorService: ColorService ) {}

  @Input('mkBorderStyle')             borderStyle   : string = 'solid';
  @Input('mkBorderPosition')          BorderPosition: string;
  @Input('mkBorderWidth')             borderWidth   : Number = 3;
  @Input('mkBorderColorCondition')    condition     : string = 'true';

  @Input('mkBorderColor') set color(color: string) {
    if(this.condition  == 'true') {this.colorService.setBorderColor(color, this.BorderPosition, this.borderWidth, this.borderStyle );}
  }
}

@Directive({selector: '[mkFontColor]',  providers: [ColorService] })
export class ColorDirective {
  /**
   * @method constructor
   * @param elementRef   [description]
   * @param renderer2    [description]
   * @param colorService [description]
   */
  constructor( private elementRef: ElementRef, private renderer2: Renderer2, private colorService: ColorService ) {}

  @Input('mkFontColor') set color(color: string) {  this.colorService.setFontColor(color); }
}
