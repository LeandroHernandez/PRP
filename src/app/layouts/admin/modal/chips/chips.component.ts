import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Librariesdate } from "app/libraries/class/class.librariesdate";
import { IChip } from "app/models/interfaces/chip";
import { IParameter } from "app/models/interfaces/parameter";
import { ChipsService } from "app/services/chips/chips.service";

@Component({
  selector: "app-chips",
  templateUrl: "./chips.component.html",
  styleUrls: ["./chips.component.css"],
})
export class ChipsComponent implements OnInit, OnDestroy {
  @Output() cancelEmitter: EventEmitter<boolean> = new EventEmitter();

  public parametersSelected: Array<IParameter | string> | null = [];
  public parametersView: boolean = false;
  public chipToEdit: IChip | null = null;
  public chipForm: FormGroup = this._fb.group({
    name: ["", [Validators.required]],
    // parameters: [[], [Validators.required]],
    parameters: [[]],
    accessPublicChip: [false],
  });
  public libraries_date = new Librariesdate();

  public get chip(): IChip | null {
    return JSON.parse(localStorage.getItem("chip") ?? null);
  }

  constructor(private _fb: FormBuilder, private _chipsSvc: ChipsService) {}

  ngOnInit(): void {
    if (this.chip) {
      this.initForm(this.chip);
    }
  }

  initForm(chip: IChip): void {
    console.log({ chip });
    this.chipForm.setValue({
      name: chip.name,
      parameters: chip.parameters,
      accessPublicChip: chip.accessPublicChip,
    });
    this.parametersSelected =
      chip.parameters.length > 0 ? chip.parameters : null;
  }

  onSubmit(): void {
    if (!this.chipForm.valid) {
      console.log("Invalid Chip");
      return;
    }

    const uid: string = this.chip
      ? this.chip.uid
      : this.libraries_date.get_timestamp_current().toString();
    this._chipsSvc
      .add_and_edit_chip(uid, {
        ...this.chipForm.value,
        uid,
        state: this.chip ? this.chip.state : true,
      })
      .then((add_and_edit_chip_response) => {
        console.log({ add_and_edit_chip_response });
        if (!this.chip) {
          this.chipForm.reset();
          this.parametersSelected = null;
        }
      })
      .catch((error) => {
        console.log({ error });
      });
  }

  parametersSelectedEmitter(event: Array<IParameter | string>): void {
    this.parametersSelected = event;
    this.chipForm.get("parameters").setValue(event);
    this.parametersView = false;
    console.log({
      event,
      parametersSelected: this.parametersSelected,
    });
  }

  removeParameterSelected(i: number): void {
    this.parametersSelected.splice(i, 1);
  }

  deleteChip(chip: IChip): void {
    this._chipsSvc
      .delete_chip(chip.uid)
      .then((deleteChipResponse) => {
        console.log({ deleteChipResponse }),
          localStorage.removeItem("chip"),
          localStorage.removeItem("modal");
      })
      .catch((error) => console.log({ error }));
  }

  cancel(): void {
    localStorage.removeItem("chip");
    localStorage.removeItem("modal");
    return this.cancelEmitter.emit(true);
  }

  ngOnDestroy(): void {
    localStorage.removeItem("chip");
  }
}
