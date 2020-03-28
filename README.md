# AdminDashboard

This project is an administration dashboard and was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.0.4.



## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag  for a production build.

# Admin Dashboard Modules 

* Accordion
* Alert Box
* Box
* Box Info
* Box Small
* BreadCrumbs
* DropDown
* Input Group
* Input Text
* Tabs

# Dashboard Layouts Modules
* Wapper
* Header
* Content    
* Sidebar Left
* Sidebar Right
* Message Dropdown Menu
* Notification Dropdown Menu
* Footer

# Modules Documentations
## Accordion Module

The accordion module is created to represent data in a dropdown page. This is made up of 2 components which control its behavior. **`"MK-ACCORDION-GROUP"`** and **`"MK-ACCORDION"`**. The mk-accordion-group serves as a container for a list of mk-accordion.

### `"MK-ACCORDION-GROUP"` Properties List


| Property        	| Type         	| Default Value 	| Description                                                                                   	|
|-----------------	|--------------	|---------------	|-----------------------------------------------------------------------------------------------	|
| activeIndex     	| boolean      	| False         	| Index of the active tab or an array of indexes to change selected accordion programmatically. 	|
| isMultiple      	| Boolean      	| False         	| Defines if multiple accordion can be opened.                                                  	|
| styleClass      	| string       	| box-group     	| Style class of the component.                                                                 	|
| onCollapseStart 	| EventEmitter 	| Null          	|                                                                                               	|
| onCollapseDone  	| EventEmitter 	| Null          	|                                                                                               	|


isMultiple: boolean
styleClass: string
onCollapseStart: EventEmitter
onCollapseDone : EventEmitter

### `"MK-ACCORDION"` Properties List
```
header: string
headerColor: string
[isSolid] : boolean
headerColorHover: string
contentColor: string
borderColor: string
```
Example:

```html
<mk-accordion-group>        
   <mk-accordion 
       header="Encabezado 1" 
       headerColor="red" 
       [isSolid] = "true" 
       headerColorHover="yellow" 
       contentColor="green" 
       borderColor="warning" >
   </mk-accordion>
   <mk-accordion 
       header="Encabezado 2" 
       headerColor="red" 
       [isSolid] = "true" 
       headerColorHover="yellow" 
       contentColor="green" 
       borderColor="info" >
   </mk-accordion>   
</mk-accordion-group>
```



