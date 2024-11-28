import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { IEducationalUnit } from "app/models/interfaces/educational-unit";
import { ILevel } from "app/models/interfaces/level";
import { LevelService } from "app/services/level/level.service";
import { Subscription } from "rxjs";

import swal from "sweetalert2";
import { AddLevelComponent } from "./add-level/add-level.component";
import { EducationalUnitService } from "app/services/educational-unit/educationalunit.service";

@Component({
  selector: "app-levels",
  templateUrl: "./levels.component.html",
  styleUrls: ["./levels.component.css"],
})
export class LevelsComponent implements OnInit {
  @Input() educationalUnit: IEducationalUnit | null = null;

  public levels: ILevel[] = [];

  public levelsToShow: ILevel[] = [];

  constructor(
    private _levelSvc: LevelService,
    private _educationalUnitSvc: EducationalUnitService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getLevels();
  }

  public getLevels(): Subscription {
    return this._levelSvc.allLevel().subscribe(
      (levels) => {
        console.log({ levels });
        this.levels = levels;
        this.levelsToShow = this.educationalUnit.levels
          ? this.levels.filter((level) =>
              this.educationalUnit.levels.includes(level.uid)
            )
          : [];
      },
      (error) => {
        console.log({ error });
        swal({
          title: "Error",
          text: "Ocurrio un error por lo que no fue posible cargar los niveles, por favor vuelva a intentarlo",
          buttonsStyling: false,
          confirmButtonClass: "btn btn-fill btn-success",
          type: "error",
        });
      }
    );
  }

  public async changeState(level: ILevel, state: boolean): Promise<void> {
    try {
      await this._levelSvc.saveLevel(level.uid, {
        ...level,
        state,
      });
      swal({
        title: "Ok",
        text: "Datos procesados correctamente!",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-fill btn-success",
        type: "success",
      }).catch(swal.noop);
    } catch (error) {
      console.log({ error });
      swal({
        title: "Error",
        text: "Ocurrio un error por lo cual no fue posible cambiar el estado del nivel, por favor vuelva a intentarlo",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-fill btn-success",
        type: "error",
      }).catch(swal.noop);
    }
  }

  openModalAddLevels(): void {
    const dialogRef = this.dialog.open(AddLevelComponent, {
      width: "400px",
      maxWidth: "90%",
      maxHeight: "90%",
    });

    dialogRef.componentInstance.educationalUnit = this.educationalUnit;
    dialogRef.componentInstance.levels = this.levels;
    //
    dialogRef.componentInstance.levelsEmitter.subscribe(
      // (levelsEmitted: ILevel[]) => this.assignLevels(levelsEmitted)
      (levelsEmitted: string[]) => this.assignLevels(levelsEmitted)
    );
    dialogRef.componentInstance.closeEmitter.subscribe(() => dialogRef.close());

    dialogRef.afterClosed().subscribe((result) => {
      this.getLevels();
      //console.log("modal cerrrdo Edit Logo")
    });
  }

  // async assignLevels(levels: ILevel[]): Promise<void> {
  async assignLevels(levels: string[]): Promise<void> {
    try {
      await this._educationalUnitSvc.save_and_update_educational_unit(
        this.educationalUnit.uid,
        { ...this.educationalUnit, levels }
      );
      this.getLevels();
      swal({
        title: "Ok",
        text: "Datos procesados correctamente!",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-fill btn-success",
        type: "success",
      }).catch(swal.noop);
    } catch (error) {
      console.log({ error });
      swal({
        title: "Error",
        text: "Ocurrio un error por lo cual no fue posible realizar la asignación, por favor vuelva a intentarlo",
        buttonsStyling: false,
        confirmButtonClass: "btn btn-fill btn-success",
        type: "error",
      }).catch(swal.noop);
    }
  }
}
