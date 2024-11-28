import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { IParameter } from "app/models/interfaces/parameter";
import { ParametersService } from "app/services/parameters/parameters.service";

@Component({
  selector: "app-parameters",
  templateUrl: "./parameters.component.html",
  styleUrls: ["./parameters.component.css"],
})
export class ParametersComponent implements OnInit {
  @Input() parametersSelected: Array<IParameter | string> | null = null;
  @Output() parametersSelectedEmitter: EventEmitter<
    Array<IParameter | string>
  > = new EventEmitter();
  public parametersValueFilter: string = "";
  public parametersFind: boolean = false;
  public parameterToView: IParameter | null = null;
  public parameterToEdit: IParameter | null = null;
  public parameters: Array<IParameter> = [];
  public registerAction: boolean = false;

  constructor(private _parametersSvc: ParametersService) {}

  ngOnInit(): void {
    this.getParameters();
    console.log({
      parametersSelected: this.parametersSelected,
    });
  }

  getParameters(): void {
    this._parametersSvc.get_all_parameter().subscribe(
      (parameters) => {
        this.parameters = parameters;
        this.parametersFind = true;
      },
      (error) => {
        console.log({ error });
        this.parametersFind = true;
      },
      () => (this.parametersFind = true)
    );
  }

  getItemsFiltered(): any[] {
    if (!this.parametersValueFilter || this.parametersValueFilter === "") {
      return this.parameters;
    }

    return this.parameters.filter((item) =>
      Object.values(item).some((value) =>
        value
          ?.toString()
          .toLowerCase()
          .includes(this.parametersValueFilter.toLowerCase())
      )
    );
  }

  clear(): void {
    this.parametersValueFilter = "";
  }

  close(): void {
    this.registerAction = false;
    this.parameterToEdit = null;
  }

  editAcion(parameter): void {
    this.parameterToEdit = parameter;
    this.registerAction = true;
  }

  deleteParameter(uid: string): void {
    this._parametersSvc
      .delete_parameter(uid)
      .then((deleteResponse) => {
        this.close();
      })
      .catch((error) => {
        console.log({ error });
        this.close();
      })
      .finally(() => this.close());
  }

  viewAction(parameter: IParameter): void {
    this.parameterToView = parameter;
    this.parametersValueFilter = parameter.name;
  }

  selectAction(parameter: IParameter): void {
    if (this.validateIncludeFunction(parameter)) {
      this.parametersSelected.splice(
        this.parametersSelected.indexOf(parameter),
        1
      );
    } else this.parametersSelected.push(parameter);
  }

  emitParamters(): void {
    this.parametersSelectedEmitter.emit(this.parametersSelected);
  }

  iSquareClass(parameter: IParameter): string {
    if (this.parametersSelected) {
      return this.validateIncludeFunction(parameter)
        ? "check-square-o"
        : "square-o";
    } else {
      return "pencil-square-o";
    }
  }

  validateIncludeFunction(parameter: IParameter): boolean {
    // return this.parametersSelected.includes(parameter);
    return this.parametersSelected.find((parameterItem: IParameter) => {
      return parameterItem.uid === parameter.uid;
    })
      ? true
      : false;
  }
}
