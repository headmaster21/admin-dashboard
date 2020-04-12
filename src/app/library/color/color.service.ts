import { Injectable, Renderer2, ElementRef, ViewChild } from '@angular/core';

import { colors, colorsAliases } from './color.definition';

@Injectable()
export class ColorService {
  private currentBackgroundStyle: any;
  private currentBackgroundClass: any;
  private currentFontStyle: any;
  private currentFontClass: any;

  /**
   * @method constructor
   * @param renderer2 [description]
   * @param elementRef [description]
   */ 

  constructor( private renderer2: Renderer2, private elementRef: ElementRef ) { this.currentBackgroundStyle = [];  }

  private setStyles(outline:boolean, color: string) {
    if(outline){
      this.currentBackgroundStyle = [];
      this.currentBackgroundStyle.push( { property: 'border-top-style', value: 'solid'})
      this.currentBackgroundStyle.push( { property: 'border-top-width', value: '3px'});
      this.currentBackgroundStyle.push( { property: 'border-top-color', value: color});
    } else this.currentBackgroundStyle.push( { property: 'background-color', value: color});
  }

  /**
   * [setBackgroundColor description]
   * 
   * @method setBackgroundColor
   * @param  color              [description]
   * @param  condition          [description]
   * @param  property           [description]
   * @param  prefix             [description]
   */

  public getColor(color:string){
    return colors[color] || (colorsAliases.indexOf(color) !== -1);
  }

  public setBackgroundColor(color: string, prefix: string, outline: boolean, issolid:boolean): void {    
    let property = 'background-color';

    if (color) {
      this.resetBackgroundColor();
      if ((colorsAliases.indexOf(color) !== -1) &&  (prefix != '' && prefix != null)) {
        this.currentBackgroundClass = !issolid ? `${prefix}-${color}`: outline ? `${prefix}-${color}` : `bg-${color}`;
        this.renderer2.addClass(this.elementRef.nativeElement, this.currentBackgroundClass);

        this.currentBackgroundClass = outline ? `${prefix}-outline` : `outline`;
        this.renderer2.addClass(this.elementRef.nativeElement, this.currentBackgroundClass);        
      } else {
        if (colors[color]) {          
          this.currentBackgroundStyle = {property: property, color: colors[color]};
          this.renderer2.setStyle(this.elementRef.nativeElement, property, colors[color]);
        } else if (color.indexOf('#') === 0 || color.indexOf('rgb') === 0) {
            this.currentBackgroundStyle = {property: property, color: color};
            this.renderer2.setStyle(this.elementRef.nativeElement, property, color);
        }  
      }
    }
  }

   /**
   * [setBackgroundColor description]
   * 
   * @method setBorderColor
   * @param  color              [description]
   * @param  BorderPosition     [description]
   * @param  borderWidth        [description]   
   * @param  borderStyle        [description]
   */

  public setBorderColor(color: string, BorderPosition?: string, borderWidth?: Number, borderStyle?:string ): void {
    if (color) {
      this.resetBordeColor();

      let property = BorderPosition ? `border-${BorderPosition.toLocaleLowerCase()}` : 'border';
      let wid      = borderWidth    ? borderWidth.toString()+'px' : '3px';
      let style    = borderStyle    ? borderStyle : 'solid';

      let selectedColor =  colors[color] ? colors[color] : (color.indexOf('#') === 0 || color.indexOf('rgb') === 0) ? color : null;

      this.renderer2.setStyle(this.elementRef.nativeElement, `${property}-style`, style);
      this.renderer2.setStyle(this.elementRef.nativeElement, `${property}-width`, wid);
      this.renderer2.setStyle(this.elementRef.nativeElement, `${property}-color`,  selectedColor);
    }
  }

  
  /**
   * [resetBackgroundColor description]
   * @method resetBackgroundColor
   */
  public resetBordeColor(): void {
    if (this.currentBackgroundStyle) {
      //this.currentBackgroundStyle.forEach( prop => this.renderer2.removeStyle(this.elementRef.nativeElement, prop['property'], prop['value']));

      this.renderer2.removeStyle(this.elementRef.nativeElement, `border-style`);
      this.renderer2.removeStyle(this.elementRef.nativeElement, `border-width`);
      this.renderer2.removeStyle(this.elementRef.nativeElement, `border-color`);
    } else if (this.currentBackgroundClass) {
      this.renderer2.removeClass(this.elementRef.nativeElement, this.currentBackgroundClass);
    }
  }

  /**
   * [resetBackgroundColor description]
   * @method resetBackgroundColor
   */
  public resetBackgroundColor(): void {
    if (this.currentBackgroundStyle) {
      this.currentBackgroundStyle.forEach( prop => this.renderer2.removeStyle(this.elementRef.nativeElement, prop['property'], prop['value']));
    } else if (this.currentBackgroundClass) {
      this.renderer2.removeClass(this.elementRef.nativeElement, this.currentBackgroundClass);
    }
  }

  /**
   * [setFontColor description]
   * @method setFontColor
   * @param  color        [description]
   */
  public setFontColor(color: string): void {
    if (color) {
      this.resetFontColor();

      if (color.indexOf('#') === 0 || color.indexOf('rgb') === 0 || colors[color]) {        
        this.currentFontStyle = color;
        this.renderer2.setStyle(this.elementRef.nativeElement, 'color', color);
      } else {
        this.currentFontClass = `text-${color}`;
        this.renderer2.addClass(this.elementRef.nativeElement, this.currentFontClass);
      }
    }
  }

  /**
   * [resetFontColor description]
   * @method resetFontColor
   * @return [description]
   */
  public resetFontColor() {
    if (this.currentFontStyle) {
      this.renderer2.removeStyle(this.elementRef.nativeElement, 'color', this.currentFontStyle);
    } else if (this.currentFontClass) {
      this.renderer2.removeClass(this.elementRef.nativeElement, this.currentFontClass);
    }
  }
}
