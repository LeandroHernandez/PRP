import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  HostListener,
} from "@angular/core";
import { Router, NavigationEnd, NavigationStart } from "@angular/router";
import { Subscription } from "rxjs/Subscription";
import { LocationStrategy, PlatformLocation, Location } from "@angular/common";
import "rxjs/add/operator/filter";
import { NavbarComponent } from "./navbar/navbar.component";

declare var $: any;

@Component({
  selector: "app-layout",
  templateUrl: "./admin-layout.component.html",
  styles: [
    `
      .wrapper {
        position: relative;
      }

      .modal {
        position: fixed;
        height: 100%;
        width: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.15);
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .modal-component {
        background-color: #ffffff;
        height: 85%;
        width: 90%;
        max-width: 90%;
      }
    `,
  ],
})
export class AdminLayoutComponent implements OnInit {
  private lastPoppedUrl: string;
  private yScrollStack: number[] = [];
  url: any;
  private _router: Subscription;
  // url: string;

  @ViewChild("sidebar") sidebar;
  @ViewChild(NavbarComponent) navbar: NavbarComponent;

  // public get showModal(): boolean {
  //   return JSON.parse(localStorage.getItem("modal") ?? "false");
  // }

  public get modal(): string | null {
    return localStorage.getItem("modal") ?? null;
  }

  constructor(private router: Router, private location: Location) {
    this.location = location;
  }

  ngOnInit() {
    if (JSON.parse(localStorage.getItem("infoUser")) === null) {
      const elemMainPanel = <HTMLElement>document.querySelector(".main-panel");
      const elemSidebar = <HTMLElement>(
        document.querySelector(".sidebar .sidebar-wrapper")
      );

      this.router.events.subscribe((event: any) => {
        if (event instanceof NavigationStart) {
          if (event.url !== this.lastPoppedUrl) {
            this.yScrollStack.push(window.scrollY);
          }
        } else if (event instanceof NavigationEnd) {
          if (event.url === this.lastPoppedUrl) {
            this.lastPoppedUrl = undefined;
            window.scrollTo(0, this.yScrollStack.pop());
          } else {
            window.scrollTo(0, 0);
          }
        }
      });
      this._router = this.router.events
        .filter((event) => event instanceof NavigationEnd)
        .subscribe((event: NavigationEnd) => {
          elemMainPanel.scrollTop = 0;
          elemSidebar.scrollTop = 0;
        });

      this._router = this.router.events
        .filter((event) => event instanceof NavigationEnd)
        .subscribe((event) => {
          //   this.url = event.url;
          this.navbar.sidebarClose();
        });

      const isWindows = navigator.platform.indexOf("Win") > -1;
      if (isWindows) {
        const $main_panel = $(".main-panel");
        $main_panel.perfectScrollbar();
      }
    } else {
      this.router
        .navigate(["login"])
        .then(() => console.log("NO SE LE PERMITE ACCEDER AL USUARIO !!!!!"));
    }
  }
  public isMap() {
    return (
      this.location.prepareExternalUrl(this.location.path()) ===
      "#/maps/fullscreen"
    );
  }
}
