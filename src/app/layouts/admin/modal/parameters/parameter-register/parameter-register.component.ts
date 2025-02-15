import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Librariesdate } from "app/libraries/class/class.librariesdate";
import { IParameter } from "app/models/interfaces/parameter";
import { LevelsService } from "app/services/levels/levels.service";
import { ParametersService } from "app/services/parameters/parameters.service";
import { NzMessageService } from "ng-zorro-antd/message";

@Component({
  selector: "app-parameter-register",
  templateUrl: "./parameter-register.component.html",
  styleUrls: ["./parameter-register.component.css"],
})
export class ParameterRegisterComponent implements OnInit {
  @Input() parameterToEdit: IParameter | null = null;
  @Output() closeEmitter: EventEmitter<boolean> = new EventEmitter();
  public levels: Array<any> = [];
  // public unitsOfMeasurement: Array<string> = [
  //   "mm",
  //   "cm",
  //   "m",
  //   "km",
  //   "Tiempo",
  //   "Seg",
  //   "min",
  //   "Hora",
  //   "Natural",
  // ];
  public unitsOfMeasurement: Array<{ group: string; options: Array<string> }> =
    [
      {
        group: "Logitud",
        options: ["mm", "cm", "m", "km"],
      },
      {
        group: "Tiempo",
        options: ["Seg", "min", "Hora"],
      },
      {
        group: "Otro",
        options: ["Natural"],
      },
    ];
  public showTypes: boolean = false;
  public typesOfParametersSections: Array<string> = [
    "Texto",
    "Número",
    "Calculo",
    "Verdadero/Falso",
    "Resultado Ideal",
  ];
  public showCalcSubsectionTypes: boolean = false;
  // public typesOfCalcSubsections: Array<string> = ["Variable", "Operación"];
  public typesOfCalcSubsections: Array<{
    label: string;
    options: Array<string>;
  }> = [
    { label: "Variable", options: ["SIN NOMBRE"] },
    {
      label: "Operación",
      options: [
        "Suma",
        "Resta",
        "División",
        "Multiplicación",
        "Mayor que",
        "Menor que",
        "Igual que",
      ],
    },
  ];

  public get sectionsNames(): Array<string> {
    return this.sections.value.map((section) => section.name);
  }
  public libraries_date = new Librariesdate();
  public parameterForm: FormGroup = this._fb.group({
    name: ["", [Validators.required]],
    level: ["", [Validators.required]],
    sections: this._fb.array([
      this._fb.group({
        name: ["Detalles", [Validators.required]],
        type: ["Texto", [Validators.required]],
        unitOfMeasurement: [""],
        value: [""],
        min: [],
        max: [],
        calcSubsectionItems: [[]],
        constant: [true, [Validators.required]],
      }),
    ]),
    finalResult: [[], [Validators.required]],
  });

  public get sections(): FormArray {
    return this.parameterForm.get("sections") as FormArray;
  }

  public get finalResult(): AbstractControl {
    return this.parameterForm.get("finalResult") as AbstractControl;
  }

  public dragStartIndex: number | null = null;

  constructor(
    private _fb: FormBuilder,
    private _parametersSvc: ParametersService,
    private _levelsSvc: LevelsService,
    private _nzMessageSvc: NzMessageService
  ) {}

  ngOnInit(): void {
    this.getDataLevel();
    // this.sections.clear();
    if (this.parameterToEdit) {
      this.initForm(this.parameterToEdit);
    }
  }

  public initForm(parameterToEdit: IParameter): void {
    console.log({ parameterToEdit });
    this.sections.clear();
    this.parameterForm.setValue({
      name: parameterToEdit.name,
      level: parameterToEdit.level ?? "",
      sections: [],
      finalResult: parameterToEdit.finalResult ?? [],
    });
    parameterToEdit.sections.forEach((section) => {
      console.log({ section });
      this.sections.push(
        this._fb.group({
          name: [section.name, [Validators.required]],
          type: [section.type, [Validators.required]],
          unitOfMeasurement: [section.unitOfMeasurement],
          value: section.value ? [section.value] : [],
          min: [],
          max: [],
          calcSubsectionItems: [section.calcSubsectionItems],
          constant: [section.constant ?? false, [Validators.required]],
        })
      );
    });
    this.changeName();
  }

  public getDataLevel(): void {
    this._levelsSvc.allLevel().subscribe(
      (levels) => {
        this.levels = levels;
      },
      (error) => console.log({ error })
    );
  }

  public onSubmit(): void {
    if (!this.parameterForm.valid || this.sections.length <= 0) {
      console.log("Invalid Form");
      console.log({ form: this.parameterForm });
      this._nzMessageSvc.warning(
        "El formulario no es valido, por favor rectifique los valores"
      );

      if (this.parameterForm.controls["finalResult"].errors.required) {
        this._nzMessageSvc.warning(
          "Resultado Final sin valor, debe especificar algún valor en el campo Resultado Final"
        );
      }
      return;
    }

    console.log({ body: this.parameterForm.value });
    const uid: string = this.parameterToEdit
      ? this.parameterToEdit.uid
      : this.libraries_date.get_timestamp_current().toString();
    this._parametersSvc
      .add_and_edit_parameter(uid, {
        ...this.parameterForm.value,
        uid,
        state: this.parameterToEdit ? this.parameterToEdit.state : true,
      })
      .then((add_and_edit_parameter_response) => {
        this._nzMessageSvc.success(
          `
          La Metrica fue 
          ${this.parameterToEdit ? "editada" : "registrada"} 
          correctamente
          `
        );
        if (!this.parameterToEdit) {
          this.sections.clear();
          this.sections.reset();
          this.parameterForm.reset();
          this.finalResult.setValue([]);
        }
        this.close();
      })
      .catch((error) => {
        console.log({ error });
        this._nzMessageSvc.error(
          `
          Hubo un error por lo que no fue posible
          ${this.parameterToEdit ? "editar" : "registrar"} 
          la metrica
          `
        );
      });
  }

  // addSection(): void {
  //   this.sections.push(
  //     this._fb.group({
  //       name: ["", [Validators.required]],
  //       type: ["", [Validators.required]],
  //       unitOfMeasurement: [""],
  //       value: [],
  //     })
  //   );
  // }

  public changeName(): void {
    this.typesOfCalcSubsections[0].options = this.sectionsNames;
  }

  public addSection(type: string): void {
    this.sections.push(
      this._fb.group({
        name: ["", [Validators.required]],
        type: [type, [Validators.required]],
        unitOfMeasurement: [
          "",
          type === "Número" ? [Validators.required] : false,
        ],
        value: [],
        min: [],
        max: [],
        calcSubsectionItems: [
          [],
          type === "Calculo" || type === "Resultado Ideal"
            ? [Validators.required, Validators.minLength(3)]
            : false,
        ],
        constant: [false, [Validators.required]],
      })
    );
    this.changeName();
  }

  // public addCalcSubsection(i: number, type: any): void {
  //   const calcSubsectionItems: Array<any> = this.sections.controls[i].get(
  //     "calcSubsectionItems"
  //   ).value;
  //   calcSubsectionItems.push(type);
  //   this.sections.controls[i]
  //     .get("calcSubsectionItems")
  //     .setValue(calcSubsectionItems);
  // }

  // public addCalcSubsection(i: number, item: number | string, finalResult?: boolean): void {
  public addCalcSubsection(
    i: number,
    item: number,
    finalResult?: boolean
  ): void {
    // const calcSubsectionItems: Array<number | string> = this.sections.controls[
    //   i
    // ].get("calcSubsectionItems").value;
    console.log({ i, item });
    if (finalResult) {
      const val = this.finalResult.value ?? [];
      val.push(item);
      this.finalResult.setValue(val);
      console.log({ val });
      return;
    }

    let calcSubsectionItems: Array<number> = this.sections.controls[i].get(
      "calcSubsectionItems"
    ).value;

    calcSubsectionItems.push(item);
    this.sections.controls[i]
      .get("calcSubsectionItems")
      .setValue(calcSubsectionItems);
  }

  public removeSection(i: number): void {
    // this.sections.removeAt(i);
    if (i < 1) {
      return;
    }

    this.sections.controls.forEach((control, j) => {
      const calcSubsectionItems: Array<number | string> =
        this.sections.controls[j].get("calcSubsectionItems").value ?? [];
      console.log({ calcSubsectionItems });
      // calcSubsectionItems.splice(i, 1);
      const list: Array<string | number> = [];
      calcSubsectionItems.forEach((item) => {
        if (typeof item !== "number" || item < i) {
          return list.push(item);
        }

        if (item === i) {
          return;
        }

        return list.push(item - 1);
      });
      this.sections.controls[j]
        .get("calcSubsectionItems")
        // .setValue(calcSubsectionItems.filter((item) => item !== i));
        .setValue(list);
    });

    const finalResultList: Array<number | string> =
      this.finalResult.value ?? [];
    // finalResultList.splice(i, 1);
    const list: Array<number | string> = [];
    finalResultList.forEach((item) => {
      // if (typeof item !== "number" || item < i) {
      //   return list.push(item);
      // }

      if (item === i) {
        return;
      }

      return list.push(typeof item !== "number" || item < i ? item : item - 1);
    });
    // this.finalResult.setValue(finalResultList.filter((item) => item !== i));
    this.finalResult.setValue(list);

    this.sections.removeAt(i);
    this.changeName();
  }

  public removeCalcSubsection(
    i: number,
    j: number,
    finalResult?: boolean
  ): void {
    if (finalResult) {
      const val = this.finalResult.value ?? [];
      val.splice(j, 1);
      this.finalResult.setValue(val);
      return;
    }

    let list: Array<number | string> = this.sections.controls[i].get(
      "calcSubsectionItems"
    ).value;

    list.splice(j, 1);
    this.sections.controls[i].get("calcSubsectionItems").setValue(list);
  }

  public close(): void {
    this.closeEmitter.emit(true);
  }

  public getSectionName(i: number): string {
    let value: string | null = this.sections.controls[i].value.name ?? null;
    return value && value !== "" ? value : `Escribir Titulo de la Metrica`;
  }

  public diferenceSection(section: number | string): string {
    return typeof section === "string" ? section : this.getSectionName(section);
    // const response: string =
    //   typeof section === "string" ? section : this.getSectionName(section);
    // console.log({ response });
    // return response;
  }

  public diferenceSectionTypeOf(section: number | string): string {
    return typeof section;
  }

  public getOperationType(type: string): string {
    switch (type) {
      case "Suma":
        return "+";
      // break;

      case "Resta":
        return "-";
      // break;

      case "División":
        return "/";
      // break;

      case "Multiplicación":
        return "*";
      // break;

      case "Mayor que":
        return ">";
      // break;

      case "Menor que":
        return "<";
      // break;

      case "Igual que":
        return "=";
      // break;

      default:
        return "";
      // break;
    }
  }

  public getSectionType(i: number): string {
    return this.sections.controls[i].value.type;
  }

  public getMin(i: number): number {
    const min: number = this.sections.controls[i].get("min").value;
    const response: number =
      typeof min === "number" ? min : Number.MIN_SAFE_INTEGER;
    this.sections.controls[i]
      .get("value")
      .setValidators(Validators.min(response));

    // return typeof min === "number" ? min : Number.MIN_SAFE_INTEGER;
    return response;
  }

  public getMax(i: number): number {
    const max: number = this.sections.controls[i].get("max").value;
    const response: number =
      typeof max === "number" ? max : Number.MAX_SAFE_INTEGER;
    this.sections.controls[i]
      .get("value")
      .setValidators(Validators.max(response));
    return response;
  }

  // public getStatus(i: number): string {
  //   const value = this.sections.controls[i].get("value").value;
  //   if (typeof value !== "number") {
  //     return "";
  //   }
  //   if (value < this.getMin(i) || value > this.getMax(i)) {
  //     return "error";
  //   }
  //   return "";
  // }

  // public getSectionMinMax(i: number): string {
  //   const min: number = this.sections.controls[i].get("min").value;
  //   const max: number = this.sections.controls[i].get("max").value;
  //   console.log({ min, max });
  //   this.sections.controls[i]
  //     .get("value")
  //     .setValidators([Validators.min(min), Validators.max(max)]);
  //   return this.sections.controls[i].value.type;
  // }

  public getSectionConstant(i: number): boolean {
    // return this.sections.controls[i].value.constant;
    const constant: boolean = this.sections.controls[i].value.constant;
    if (!constant) {
      this.sections.controls[i].patchValue({
        value: null,
      });
    }
    return constant;
  }

  public changeRequiredStatus(i: number): void {
    const constant: boolean = this.getSectionConstant(i);
    console.log({ constant });
    if (!constant) {
      this.sections.controls[i].get("value").clearValidators();
    } else {
      this.sections.controls[i]
        .get("value")
        .setValidators([Validators.required]);
    }
    this.sections.controls[i].get("value").updateValueAndValidity();
  }

  onDragStart(index: number): void {
    this.dragStartIndex = index;
  }

  onDrop(i: number, n: number, finalResult?: boolean): void {
    const list = finalResult
      ? this.finalResult.value
      : this.sections.controls[i].get("calcSubsectionItems").value;
    const item = list[this.dragStartIndex];
    list.splice(this.dragStartIndex, 1);
    list.splice(n, 0, item);
    finalResult
      ? this.finalResult.setValue(list)
      : this.sections.controls[i].get("calcSubsectionItems").setValue(list);
    this.dragStartIndex = null;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  public isConsecutiveSameType(subCards: any[]): boolean {
    for (let i = 0; i < subCards.length - 1; i++) {
      // const currentIsVariable = typeof subCards[i] === 'object' && 'name' in subCards[i];
      const currentIsVariable = typeof subCards[i];
      // const nextIsVariable = typeof subCards[i + 1] === 'object' && 'name' in subCards[i + 1];
      const nextIsVariable = typeof subCards[i + 1];

      if (currentIsVariable === nextIsVariable) {
        return true;
      }
    }
    return false;
  }

  public calcSubsectionItemsValidator(i?: number): boolean {
    // const list: Array<number | string> = i
    //   ? this.sections.controls[i].get("calcSubsectionItems").value
    //   : this.finalResult.value;

    const control =
      i !== undefined
        ? this.sections.controls[i].get("calcSubsectionItems")
        : this.finalResult;

    const list: Array<number | string> = control.value;

    if (
      typeof list[0] === "string" ||
      typeof list[list.length - 1] === "string" ||
      this.isConsecutiveSameType(list)
    ) {
      control.setErrors({
        invalidOrder: "El orden de los elementos es incorrecto.",
      });
      return true;
    }

    // control.setErrors(null);
    return false;
  }
}
