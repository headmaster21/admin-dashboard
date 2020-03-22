import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren
} from '@angular/core';
import {Event as RouterEvent, NavigationEnd, PRIMARY_OUTLET, Router} from '@angular/router';

import {RoutingService} from '../../services/routing.service';

import {WrapperService} from '../wrapper/wrapper.service';
import {HeaderService} from '../header/header.service';

import {LayoutStore} from '../layout.store';

import {AnimationEvent} from '../../animations/animations.interface';
import {removeListeners, removeSubscriptions} from '../../helpers';

import {SidebarLeftToggleDirective} from './sidebar-left.directive';

export interface Item {
  id: number;
  parentId: number;
  label: string;
  route?: string;
  iconClasses?: string;
  children?: Array<Item>;
  isActive?: boolean;
  isCollapsed?: boolean;
  disableCollapse?: boolean;
}

export type Items = Array<Item>;

@Component({
  selector: 'mk-layout-sidebar-left',
  templateUrl: './sidebar-left.component.html',
  styleUrls: ['./sidebar-left.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarLeftComponent implements OnInit, OnDestroy {
  public menu: Array<any>;
  public sidebarHeight: number;
  public sidebarOverflow: string;

  private layout: string;
  private isSidebarLeftExpandOnOver: boolean;
  private windowInnerWidth: number;
  private windowInnerHeight: number;
  private collapsedItems: Items = [];
  private activatedItems: Items = [];
  private itemsByIds: {[propKey: number]: Item} = {};
  private subscriptions = [];
  private activeUrl: String;
  private initialized: boolean;
    
  @ViewChild('sidebarElement') public sidebarElement: ElementRef;

  @ViewChildren(SidebarLeftToggleDirective) public sidebarLeftToggleDirectives: QueryList<SidebarLeftToggleDirective>;

  /**
   * @method constructor
   * @param  changeDetectorRef  [description]
   * @param  layoutStore        [description]
   * @param  ngZone             [description]
   * @param  renderer2          [description]
   * @param  router             [description]
   * @param  routingService     [description]
   * @param  wrapperService     [description]
   * @param  headerService      [description]
   */
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private layoutStore: LayoutStore,
    private ngZone: NgZone,
    private renderer2: Renderer2,
    private router: Router,
    private routingService: RoutingService,
    private wrapperService: WrapperService,
    private headerService: HeaderService
  ) {}

  /**
   * @method ngOnInit
   */
  ngOnInit() {

    this.subscriptions.push(this.layoutStore.sidebarLeftMenu.subscribe(value => {
      this.menu = value;
      this.monkeyPatchMenu(this.menu);
      if (this.initialized) {
        this.setMenuListeners(this.activeUrl);
      }
      this.initialized = true;
    }));
    this.subscriptions.push(this.layoutStore.sidebarLeftMenuActiveUrl.subscribe(value => {
      this.activeUrl = value;
      this.setMenuListeners(value);
    }));
    this.subscriptions.push(this.routingService.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.activeUrl = event.url;
        this.setMenuListeners(event.url);
      }
    }));

    //this.setSidebarListeners();
  }

  /**
   * @method ngOnDestroy
   */
  ngOnDestroy() {
    this.subscriptions = removeSubscriptions(this.subscriptions);
  }


  /**
   * [setMenuListeners description]
   * @method setMenuListeners
   */
  setMenuListeners(url): void {
    if (url === '/') {
      this.activeItems(url);
      this.changeDetectorRef.detectChanges();
    } else {
      const primaryOutlet = this.router.parseUrl(url).root.children[PRIMARY_OUTLET];
      if (primaryOutlet) {
        this.activeItems(primaryOutlet.toString());
        this.changeDetectorRef.detectChanges();
      }
    }
    if (this.windowInnerWidth <= 767 || this.isSidebarLeftExpandOnOver) {
      this.layoutStore.sidebarLeftCollapsed(true);
    }
  }

  /**
   * [getIconClasses description]
   * @method getIconClasses
   * @param item [description]
   * @return [description]
   */
  public getIconClasses(item: Item): string {
    if (item.iconClasses || item.iconClasses === '') {
      return item.iconClasses;
    } else {
      return 'far fa-circle';
    }
  }

  /**
   * [uncollapseItemParents description]
   * @method uncollapseItemParents
   * @param item           [description]
   * @param isActive       [description]
   */
  private uncollapseItemParents(item: Item, isActive = false): void {
    if (isActive) {
      item.isActive = true;
      this.activatedItems.push(item);
    }
    item.isCollapsed = false;
    this.collapsedItems.push(item);
    if (item.parentId) {
      this.uncollapseItemParents(this.itemsByIds[item.parentId], isActive);
    }
  }

  /**
   * [findItemsByUrl description]
   * @method findItemsByUrl
   * @param url   [description]
   * @param items [description]
   * @param returnItems [description]
   * @return [description]
   */
  private findItemsByUrl(url: string, items: Items, returnItems: Items = []): Items {
    items.forEach((item: Item) => {
      if (item.route === url) {
        returnItems.push(item);
      } else if (item.children) {
        this.findItemsByUrl(url, item.children, returnItems);
      }
    });
    return returnItems;
  }

  /**
   * [activeItems description]
   * @method activeItems
   * @param url [description]
   */
  private activeItems(url: string): void {
    this.activatedItems.forEach((item: Item) => {
      item.isActive = false;
    });
    this.activatedItems = [];

    this.collapsedItems.forEach((item: Item) => {
      item.isActive = false;
      item.isCollapsed = true;
    });
    this.collapsedItems = [];

    const items = this.findItemsByUrl(url, this.menu);
    items.forEach(item => {
      item.isActive = true;
      this.uncollapseItemParents(item, true);
      this.activatedItems.push(item);
    });
  }

  /**
   * [monkeyPatchMenu description]
   * @method monkeyPatchMenu
   * @param items    [description]
   * @param parentId [description]
   */
  private monkeyPatchMenu(items: Items, parentId?: number): void {
    items.forEach((item: Item, index: number) => {
      item.id = parentId ? Number(parentId + '' + (index + 1)) : index + 1;
      if (parentId) { item.parentId = parentId; }
      if (!item.disableCollapse) { item.isCollapsed = true; }
      item.isActive = false;
      if (parentId || item.children) { this.itemsByIds[item.id] = item;  }
      if (item.children) { this.monkeyPatchMenu(item.children, item.id); }
    });
  }


  /**
   * [setSidebarHeight description]
   * @method setSidebarHeight
   */
  private setSidebarHeight(): void {
    if (this.layout === 'fixed') {
      const height = this.windowInnerHeight - this.headerService.offsetHeight;
      if (height && height !== this.sidebarHeight) {
        this.sidebarHeight = height;
        this.sidebarOverflow = 'auto';
        this.changeDetectorRef.detectChanges();
      }
    } else if (this.sidebarHeight) {
      this.sidebarOverflow = this.sidebarHeight = null;
      this.changeDetectorRef.detectChanges();
    }
  }
}
