import {
  Component,
  OnInit,
  Renderer2,
  ViewChild,
  ElementRef,
  Directive,
} from "@angular/core";

import { Router, ActivatedRoute } from "@angular/router";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { ROUTES } from "../sidebar/sidebar.component";
import { AuthService } from "../../../services/login/auth.service";

var misc: any = {
  navbar_menu_visible: 0,
  active_collapse: true,
  disabled_collapse_init: 0,
};
declare var $: any;

@Component({
  moduleId: module.id,
  selector: "navbar-cmp",
  templateUrl: "navbar.component.html",
  styles: [
    `
      nav.navbar-default {
        position: sticky;
        top: 0;
        right: 0;
        z-index: 100;
      }
    `,
  ],
})
export class NavbarComponent implements OnInit {
  public infoUser;
  private listTitles: any[];
  location: Location;
  private nativeElement: Node;
  private toggleButton;
  private sidebarVisible: boolean;

  @ViewChild("navbar-cmp") button;

  constructor(
    location: Location,
    private renderer: Renderer2,
    private element: ElementRef,
    public authService: AuthService
  ) {
    this.location = location;
    this.nativeElement = element.nativeElement;
    this.sidebarVisible = false;
  }

  ngOnInit() {
    this.infoUser = JSON.parse(localStorage.getItem("infoUser"));

    this.listTitles = ROUTES.filter((listTitle) => listTitle);

    const navbar: HTMLElement = this.element.nativeElement;
    this.toggleButton = navbar.getElementsByClassName("navbar-toggle")[0];
    if ($("body").hasClass("sidebar-mini")) {
      misc.sidebar_mini_active = true;
    }
    $("#minimizeSidebar").click(function () {
      if (misc.sidebar_mini_active === true) {
        $("body").removeClass("sidebar-mini");
        misc.sidebar_mini_active = false;
      } else {
        setTimeout(function () {
          $("body").addClass("sidebar-mini");
          misc.sidebar_mini_active = true;
        }, 300);
      }

      // we simulate the window Resize so the charts will get updated in realtime.
      const simulateWindowResize = setInterval(function () {
        window.dispatchEvent(new Event("resize"));
      }, 180);

      // we stop the simulation of Window Resize after the animations are completed
      setTimeout(function () {
        clearInterval(simulateWindowResize);
      }, 1000);
    });
  }

  isMobileMenu() {
    if ($(window).width() < 991) {
      return false;
    }
    return true;
  }

  sidebarOpen() {
    const toggleButton = this.toggleButton;
    const body = document.getElementsByTagName("body")[0];
    setTimeout(function () {
      toggleButton.classList.add("toggled");
    }, 500);
    body.classList.add("nav-open");
    this.sidebarVisible = true;
  }
  sidebarClose() {
    const body = document.getElementsByTagName("body")[0];
    this.toggleButton.classList.remove("toggled");
    this.sidebarVisible = false;
    body.classList.remove("nav-open");
  }
  sidebarToggle() {
    if (this.sidebarVisible === false) {
      this.sidebarOpen();
    } else {
      this.sidebarClose();
    }
  }

  getTitle() {
    let title = this.location.prepareExternalUrl(this.location.path());
    if (title.charAt(0) === "#") {
      title = title.slice(1);
    }
    let componentTitle = "";
    /*  for (let i = 0; i < this.listTitles.length; i++) {
            if (this.listTitles[i].type === "link" && this.listTitles[i].path === titlee) {
                return this.listTitles[i].title;
            } else if (this.listTitles[i].type === "sub") {
                for (let j = 0; j < this.listTitles[i].children.length; j++) {
                    let subtitle = this.listTitles[i].path + '/' + this.listTitles[i].children[j].path;
                    // console.log(subtitle)
                    // console.log(titlee)
                    if (subtitle === titlee) {
                        return this.listTitles[i].children[j].title;
                    }
                }
            }
        }*/
    switch (title) {
      case "/teachersubjects": {
        componentTitle = "Inicio";
        break;
      }
      case "/adminpractice": {
        componentTitle = "Prácticas y Evaluaciones";
        break;
      }
      case "/studentsubjects": {
        componentTitle = "Inicio";
        break;
      }
      case "/representativehome": {
        componentTitle = "Inicio";
        break;
      }
      case "/admineducationalunit": {
        componentTitle = "Niveles";
        break;
      }
      case "/representative": {
        componentTitle = "Listado de Representantes";
        break;
      }
      case "/teachers": {
        componentTitle = "Listado de Profesores";
        break;
      }
      case "/student": {
        componentTitle = "Listado de Estudiantes";
        break;
      }
      case "/fichas": {
        componentTitle = "Fichas";
        break;
      }
    }
    return componentTitle;
  }

  getPath() {
    // console.log(this.location);
    return this.location.prepareExternalUrl(this.location.path());
  }

  SignOut() {
    this.authService.SignOut();
  }
}
