import { Component, OnInit } from "@angular/core";
import { ChipsComponent } from "app/layouts/admin/modal/chips/chips.component";
import { ParametersComponent } from "app/layouts/admin/modal/parameters/parameters.component";
import { IChip } from "app/models/interfaces/chip";
import { ChipsService } from "app/services/chips/chips.service";
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";

@Component({
  selector: "app-player-chips-and-parameters",
  templateUrl: "./player-chips-and-parameters.component.html",
  styleUrls: ["./player-chips-and-parameters.component.css"],
})
export class PlayerChipsAndParametersComponent implements OnInit {
  public chips: Array<IChip> = [];
  public searchFinish: boolean = false;
  public chipsValueFilter: string = "";

  constructor(
    private _chipsSvc: ChipsService,
    private modalService: NzModalService
  ) {}

  ngOnInit(): void {
    localStorage.removeItem("chip");
    this.getChips();
  }

  getChips(): void {
    this._chipsSvc.get_all_chip().subscribe(
      (chips) => {
        this.chips = chips;
        this.searchFinish = true;
        console.log({ chips });
      },
      (error) => {
        console.log({ error });
        this.searchFinish = true;
      },
      () => (this.searchFinish = true)
    );
  }

  showModal(content: string): void {
    // localStorage.setItem("modal", content);

    if (content === "chips") {
      const modal: NzModalRef<ChipsComponent, any> = this.modalService.create({
        nzTitle: "Fichas",
        nzContent: ChipsComponent,
        nzFooter: null,
        nzStyle: {
          top: "50%",
          transform: "translateY(-50%)",
        },
        nzBodyStyle: {
          maxHeight: "85vh",
          overflowY: "auto",
          overflowX: "hidden",
        },
      });

      if (modal.componentInstance)
        modal.componentInstance.cancelEmitter.subscribe(() => {
          modal.close();
        });
    }

    if (content === "parameters") {
      this.modalService.create({
        nzTitle: "Registro de Metricas",
        nzContent: ParametersComponent,
        nzFooter: null,
        nzStyle: {
          top: "50%",
          transform: "translateY(-50%)",
        },
        nzBodyStyle: {
          maxHeight: "85vh",
          overflowY: "auto",
        },
      });
    }
  }

  showChip(chip: IChip): void {
    localStorage.setItem("chip", JSON.stringify(chip));
  }

  getItemsFiltered(): any[] {
    if (!this.chipsValueFilter || this.chipsValueFilter === "") {
      return this.chips;
    }

    return this.chips.filter((item) => {
      return item.name
        .toLowerCase()
        .includes(this.chipsValueFilter.toLowerCase());
    });
  }
}
