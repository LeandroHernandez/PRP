import {Component, OnInit, AfterViewInit, AfterViewChecked, AfterContentInit} from '@angular/core';
import {SidebarService} from '../../../services/sidebar/sidebar.service';
import {AuthService} from '../../../services/login/auth.service';

declare var $: any;

// Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    // icon: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}

// Menu Items
export const ROUTES: RouteInfo[] = [

];

@Component({
    moduleId: module.id,
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent {
    public menuItems: any[];
    public infoUser;

    isNotMobileMenu() {
        return $(window).width() <= 991;
    }


    constructor(
        public sidebarService: SidebarService,
        public authService: AuthService
    ) {

    }


    ngOnInit() {
        this.infoUser = JSON.parse(localStorage.getItem('infoUser'))

        this.sidebarService
            .renderMenu()
            .subscribe(resp => {
             console.log('hola',resp)
             
              this.menuItems = resp;
            });

        let isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

        isWindows = navigator.platform.indexOf('Win') > -1 ? true : false;

        if (isWindows) {
            // if we are on windows OS we activate the perfectScrollbar function
            $('.sidebar .sidebar-wrapper, .main-panel').perfectScrollbar();
            $('html').addClass('perfect-scrollbar-on');
        } else {
            $('html').addClass('perfect-scrollbar-off');
        }
    }

    ngAfterViewInit() {
        const $sidebarParent = $('.sidebar .nav > li.active .collapse li.active > a').parent().parent().parent();

        const collapseId = $sidebarParent.siblings('a').attr('href');

        $(collapseId).collapse('show');
    }

    SignOut() {
        this.authService.SignOut();
    }
}
