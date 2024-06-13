import {Component, OnInit, ValueProvider, ViewChild, ElementRef, HostListener} from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-landingpage',
  templateUrl: './landingpage.component.html',
  styleUrls: ['./landingpage.component.css']
})
export class LandingpageComponent implements OnInit {
  /** Array menu */
  year = new Date().getFullYear();
  public ids: Array<string> = ['Inicio', 'Quiénes somos', 'Cómo Funciona', 'Planes', 'Contacto'];
  menuPosition: any;

  @ViewChild('navBurger') navBurger: ElementRef;
  @ViewChild('navMenu') navMenu: ElementRef;
  sticky: Boolean = false;

  constructor() {
  }

  ngOnInit() {

  }

  /** METODO PARA LISTAR U OCULTAR NAV-VAR */
  toggleNavbar() {
    this.navBurger.nativeElement.classList.toggle('is-active');
    this.navMenu.nativeElement.classList.toggle('is-active');
  }

  /** ASIGNAR POSITION FIXED AL REALIZAR SCROLL  */
  @HostListener('window:scroll', ['$event'])
  handleScroll() {
    const windowScroll = window.pageYOffset;
    if (windowScroll >= this.menuPosition) {
      this.sticky = true;
    } else {
      this.sticky = false;
    }
  }

}
