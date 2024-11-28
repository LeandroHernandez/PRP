import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Librariesdate } from "app/libraries/class/class.librariesdate";
import { ILevel } from "app/models/interfaces/level";
import { LevelService } from "app/services/level/level.service";

import swal from "sweetalert2";

@Component({
  selector: "app-add-level",
  templateUrl: "./add-level.component.html",
  styleUrls: ["./add-level.component.css"],
})
export class AddLevelComponent implements OnInit {
  @Input() level: ILevel | null = null;
  @Output() closeEmitter: EventEmitter<boolean> = new EventEmitter();

  public libraries_date = new Librariesdate();

  public form: FormGroup = this._fb.group({
    uid: [""],
    name: [""],
    state: [false],
  });

  constructor(private _fb: FormBuilder, private _levelSvc: LevelService) {}

  ngOnInit(): void {
    console.log({ level: this.level });
    if (this.level) {
      this.initForm(this.level);
    }
  }

  public initForm(level: ILevel): void {
    console.log({ level });
    this.form.setValue({
      uid: level.uid,
      name: level.name,
      state: level.state,
    });
  }

  submit(): void {
    const uid = this.level
      ? this.level.uid
      : this.libraries_date.get_timestamp_current().toString();
    this.form.get("uid").setValue(uid);

    this.form.controls["uid"].setValidators([Validators.required]);
    this.form.controls["name"].setValidators([Validators.required]);
    this.form.controls["state"].setValidators([Validators.required]);
    console.log({ form: this.form });
    if (!this.form.valid) {
      console.log("Invalid Form");

      swal({
        title: "Formulario Invalido",
        text: "El formulario es invalido, por favor rectifique los valores",
        type: "warning",
        cancelButtonClass: "btn btn-fill btn-danger",
      });
    }

    this._levelSvc
      .saveLevel(uid, { ...this.form.value, uid })
      .then(() => {
        swal({
          // title: "Registrado",
          title: this.level ? "editado" : "registrado",
          text: `El nivel fue ${
            this.level ? "editado" : "registrado"
          } correctamente`,
          type: "success",
          cancelButtonClass: "btn btn-fill btn-danger",
        });

        this.form.reset();
        this.form.clearValidators();
      })
      .catch((error) => {
        console.log({ error });
        swal({
          title: "Error",
          text: `Hubo un error y no fue posible ${
            this.level ? "editar" : "registrar"
          } el nivel, por favor vuelva a intentarlo`,
          type: "error",
          cancelButtonClass: "btn btn-fill btn-danger",
        });
      });
  }

  close() {
    this.closeEmitter.emit(true);
  }
}
