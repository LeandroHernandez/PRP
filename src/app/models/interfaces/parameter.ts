import { IChip } from "./chip";

export interface IParameter {
  uid?: string;
  name: string;
  state: boolean;
  level?: string;
  sections: Array<IParameterSection>;
  assignedChip?: IChip | string;
}

interface IParameterSection {
  name: string;
  // type: string | number | ICalc | boolean | IDealResult;
  type: string;
  value?: string | number | ICalc | boolean | IDealResult;
  unitOfMeasurement?: string;
  calcSubsectionItems?: [];
  constant?: boolean;
}

interface ICalc {
  name: string;
  type?: string;
  composition: Array<IParameterSection | string>;
}

interface IDealResult {
  name: string;
}
