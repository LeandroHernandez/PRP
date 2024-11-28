import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
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
  public unitsOfMeasurement: Array<{ group: string; options: Array<string> }> = [
    {
      group: 'Logitud',
      options: [
        "mm",
        "cm",
        "m",
        "km",
      ],
    },
    {
      group: 'Tiempo',
      options: [
        "Seg",
        "min",
        "Hora",
      ],
    },
    {
      group: 'Otro',
      options: [
        "Natural",
      ],
    }
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
        name: ["", [Validators.required]],
        type: ["", [Validators.required]],
        unitOfMeasurement: [""],
        value: [],
        calcSubsectionItems: [[]],
        constant: [false, [Validators.required]],
      }),
    ]),
  });

  public get sections(): FormArray {
    return this.parameterForm.get("sections") as FormArray;
  }

  public dragStartIndex: number | null = null;

  constructor(
    private _fb: FormBuilder,
    private _parametersSvc: ParametersService,
    private _levelsSvc: LevelsService,
    private _nzMessageSvc: NzMessageService,
  ) {}

  ngOnInit(): void {
    this.getDataLevel();
    this.sections.clear();
    if (this.parameterToEdit) {
      this.initForm(this.parameterToEdit);
    }
  }

  public initForm(parameterToEdit: IParameter): void {
    this.parameterForm.setValue({
      name: parameterToEdit.name,
      level: parameterToEdit.level ?? "",
      sections: [],
    });
    parameterToEdit.sections.forEach((section) => {
      this.sections.push(
        this._fb.group({
          name: [section.name, [Validators.required]],
          type: [section.type, [Validators.required]],
          unitOfMeasurement: [section.unitOfMeasurement],
          value: [],
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
      this._nzMessageSvc.warning('El formulario no es valido, por favor rectifique los valores')
      return;
    }
    const uid: string = this.parameterToEdit
      ? this.parameterToEdit.uid
      : this.libraries_date.get_timestamp_current().toString();
    this._parametersSvc
      .add_and_edit_parameter(uid, {
        ...this.parameterForm.value,
        uid,
        state: true,
      })
      .then((add_and_edit_parameter_response) => {
        this._nzMessageSvc.success(
          `
          La Metrica fue 
          ${
            this.parameterToEdit ? 
            'editada' : 
            'registrada'
          } 
          correctamente
          `
        )
        this.sections.clear();
        this.sections.reset();
        this.parameterForm.reset();
      })
      .catch((error) => {
        console.log({ error });
        this._nzMessageSvc.error(
          `
          Hubo un error por lo que no fue posible
          ${
            this.parameterToEdit ? 
            'editar' : 
            'registrar'
          } 
          la metrica
          `
        )
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
        unitOfMeasurement: ["", type === 'Número' ? [Validators.required] : false],
        value: [],
        calcSubsectionItems: [
          [], 
          type === 'Calculo' || 
          type === 'Resultado Ideal' ? 
          [Validators.required, Validators.minLength(1)] : 
          false
        ],
        constant: [false, [Validators.required]]
      })
    );
    this.changeName();
  }

  // addCalcSubsection(i: number, type: string): void {
  public addCalcSubsection(i: number, type: any): void {
    const calcSubsectionItems: Array<any> = this.sections.controls[i].get(
      "calcSubsectionItems"
    ).value;
    calcSubsectionItems.push(type);
    this.sections.controls[i]
      .get("calcSubsectionItems")
      .setValue(calcSubsectionItems);
  }

  public removeSection(i: number): void {
    this.sections.removeAt(i);
    this.changeName();
  }

  public close(): void {
    this.closeEmitter.emit(true);
  }

  public getSectionName(i: number): string {
    const value: string | null = this.sections.controls[i].value.name ?? null;
    return value && value !== '' ? value : `Escribir Titulo de la Metrica`;
  }

  public getSectionType(i: number): string {
    return this.sections.controls[i].value.type;
  }

  public getSectionConstant(i: number): boolean {
    // return this.sections.controls[i].value.constant;
    const constant: boolean = this.sections.controls[i].value.constant;
    if(!constant) {
      this.sections.controls[i].setValue({...this.sections.controls[i].value, value: null});
    }
    return constant;
  }
  
  onDragStart(index: number): void {
    this.dragStartIndex = index;
  }

  onDrop( i:number, n: number): void {
    const list = this.sections.controls[i].get(
      "calcSubsectionItems"
    ).value;
    const item = list[this.dragStartIndex]
    list.splice(this.dragStartIndex, 1);
    list.splice(n, 0, item);
    this.sections.controls[i].get(
      "calcSubsectionItems"
    ).setValue(list);
    this.dragStartIndex = null;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  public isConsecutiveSameType(subCards: any[]): boolean {
  for (let i = 0; i < subCards.length - 1; i++) {
    const currentIsVariable = typeof subCards[i] === 'object' && 'name' in subCards[i];
    const nextIsVariable = typeof subCards[i + 1] === 'object' && 'name' in subCards[i + 1];

    if (currentIsVariable === nextIsVariable) {
      return true;
    }
  }
  return false;
}

  public calcSubsectionItemsValidator(i: number): boolean {
    const list: any[] = this.sections.controls[i].get('calcSubsectionItems').value;

    if (
      typeof list[0] === 'string' || 
      typeof list[list.length - 1] === 'string' || 
      this.isConsecutiveSameType(list)
    ) {
      return true;
    }

    return false;
  }
}
