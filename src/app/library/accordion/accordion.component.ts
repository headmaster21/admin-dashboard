import { 
  AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, ContentChild,
  ContentChildren, EventEmitter, Input, NgZone, OnChanges, OnDestroy,  OnInit,
  Output, QueryList, Renderer2, SimpleChanges, TemplateRef, ViewChild, ViewChildren,
} from '@angular/core';

import { colors, colorsAliases } from '../color/color.definition';

import { AnimationEvent } from '../animations/animations.interface';

import { AccordionToggleDirective } from './accordion.directive';

import { removeListeners, removeSubscriptions } from '../helpers';
import { Subscription } from 'rxjs';
import { Content } from '@angular/compiler/src/render3/r3_ast';

@Component({
  selector: 'mk-accordion-header',
  template: '<ng-template #templateRef><ng-content></ng-content></ng-template>'
})
export class AccordionHeaderComponent {
  @ViewChild('templateRef', {static: true}) public templateRef: TemplateRef<any>;
}

@Component({
  selector: 'mk-accordion-content',
  template: '<ng-template #templateRef><ng-content></ng-content></ng-template>'
})
export class AccordionContentComponent {
  @ViewChild('templateRef', {static: true}) public templateRef: TemplateRef<any>;
}

@Component({
  selector: 'mk-accordion',
  template: '<ng-template #templateRef><ng-content></ng-content></ng-template>',
})
export class AccordionComponent implements OnInit {
  public contentTemplateRef: TemplateRef<AccordionContentComponent>;
  public headerStyleColor: string;
  public isCollapsing: boolean;
  public isCollapsed: boolean;
  public index: number;  

  @Input() public styleClass = 'card';

  @Input() public isSolid = false;  
  @Input() public isOutline = false;

  @Input() public Color: string;

  @Input() public borderColor: string;
  @Input() public contentColor: string;
  @Input() public contentStyleClass ='card-body';  
  @Input() public header: string;
  @Input() public headerColor: string;
  @Input() public headerFontColor: string = '#000';
  @Input() public headerColorHover: string;  
  @Input() public headerFontIcon: string = '';
  @Input() public headerStyleClass = 'card-header';  
  @Input() public headerStyle = '';

  @Input() public buttonsStyleClass = 'btn btn-box-tool';


  @ContentChild(AccordionHeaderComponent, {static: true}) public accordionHeaderComponent: AccordionHeaderComponent;
  @ContentChild(AccordionContentComponent, {static: true}) public accordionContentComponent: AccordionContentComponent;

  @ViewChild('templateRef', {static: true}) public templateRef: TemplateRef<any>;
  
  ngOnInit() {      
    this.headerStyleColor = this.headerFontColor;// this.headerColor;

    if (!this.header && !this.accordionHeaderComponent) { throw new Error('Attribute "header" OR Component "accordion-header" is required for component "accordion"'); }
    if (this.accordionContentComponent) { this.contentTemplateRef = this.accordionContentComponent.templateRef;} else { this.contentTemplateRef = this.templateRef; }
  }
}

@Component({
  selector: 'mk-accordion-group',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.css'],
})
export class AccordionGroupComponent implements AfterContentInit, AfterViewInit, OnChanges, OnDestroy {
  private activeIndex: any = [0];
  private listeners: Array<Function> = [];
  private subscriptions: Array<Subscription> = [];

  @ContentChild('accordionHeader') accordionHeader;


  @Input('activeIndex') set _activeIndex(value) { this.activeIndex = value instanceof Array ? value : [value]; }
  @Input() public isMultiple: boolean;
  @Input() public styleClass = 'box-group';

  @Output() public onCollapseStart = new EventEmitter();
  @Output() public onCollapseDone = new EventEmitter();

  @ContentChildren(AccordionComponent) public accordionComponents: QueryList<AccordionComponent>;

  @ViewChildren(AccordionToggleDirective) private accordionToggleDirectives: QueryList<AccordionToggleDirective>;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private ngZone: NgZone,
    private renderer2: Renderer2
  ) {}

  public static headerMouseLeave(accordion: AccordionComponent): void {
    accordion.headerStyleColor = accordion.headerFontColor;// accordion.headerColor;
  }

  public static headerMouseEnter(accordion: AccordionComponent): void {    
    if (accordion.headerColorHover) { accordion.headerStyleColor = accordion.headerColorHover; }
  }

  ngAfterContentInit() {
    this.setAccordionsIndex();
    this.updateAccordionIsCollapsed();
    this.subscriptions.push(this.accordionComponents.changes.subscribe(() => { this.setAccordionsIndex(); }));
  }

  public getAliaColor(color: string): Boolean{  return (colorsAliases.indexOf(color) > -1); }
  public showIcon(icon){ return icon !='' && icon !=null; }

  ngAfterViewInit() {
    this.setAccordionsToggle();
    this.subscriptions.push(this.accordionToggleDirectives.changes.subscribe(() => { this.setAccordionsToggle(); }));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes._activeIndex.firstChange === false) { this.updateAccordionIsCollapsed(); }
  }

  ngOnDestroy() {
    removeListeners(this.listeners);
    removeSubscriptions(this.subscriptions);
  }

  public toggleAccordion(event: Event, toggleIndex: number): void {
    event.preventDefault();

    const indexOf = this.activeIndex['indexOf'](toggleIndex);
    if (indexOf === -1) {
      if (this.isMultiple) {
        this.activeIndex.push(toggleIndex);
      } else {
        this.activeIndex = [toggleIndex];
      }
    } else {
      if (this.isMultiple) {
        this.activeIndex.splice(indexOf, 1);
      } else {
        this.activeIndex = [];
      }
    }
    this.updateAccordionIsCollapsed();
  }

  public collapseStart(event: AnimationEvent, accordion: AccordionComponent): void {
    accordion.isCollapsing = true;
    this.onCollapseStart.emit({animationEvent: event, index: accordion.index});
  }

  public collapseDone(event: AnimationEvent, accordion: AccordionComponent): void {
    accordion.isCollapsing = false;
    this.onCollapseDone.emit({animationEvent: event, index: accordion.index});
  }

  private setAccordionsIndex(): void {
    this.accordionComponents.forEach((accordion: AccordionComponent, index: number) => { accordion.index = index; });
  }

  private setAccordionsToggle(): void {
    this.listeners = removeListeners(this.listeners);

    this.ngZone.runOutsideAngular(() => {
      this.accordionToggleDirectives.forEach((accordionToggle: AccordionToggleDirective) => {
        this.listeners.push(this.renderer2.listen(accordionToggle.elementRef.nativeElement, 'click', (event) => {
          this.toggleAccordion(event, accordionToggle.accordionComponent.index);
          this.changeDetectorRef.detectChanges();
        }));
        this.listeners.push(this.renderer2.listen(accordionToggle.elementRef.nativeElement, 'mouseenter', () => {                    
          AccordionGroupComponent.headerMouseEnter(accordionToggle.accordionComponent);
          this.changeDetectorRef.detectChanges();
        }));
        this.listeners.push(this.renderer2.listen(accordionToggle.elementRef.nativeElement, 'mouseleave', () => {
          AccordionGroupComponent.headerMouseLeave(accordionToggle.accordionComponent);
          this.changeDetectorRef.detectChanges();
        }));
      });
    });
  }

  private updateAccordionIsCollapsed(): void {
    this.accordionComponents.forEach((accordion: AccordionComponent, index: number) => {
      accordion.isCollapsed = this.activeIndex.indexOf(index) === -1;
    });
  }
}
