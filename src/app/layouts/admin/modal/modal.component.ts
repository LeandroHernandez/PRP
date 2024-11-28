import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.css"],
})
export class ModalComponent implements OnInit {
  @Input() modal: string | null = null;
  constructor() {}

  ngOnInit(): void {}

  close(): void {
    localStorage.removeItem("modal");
  }
}
