import { IParameter } from "./parameter";

export interface IChip {
  uid: string;
  name: string;
  accessPublicChip?: boolean;
  parameters?: Array<IParameter | string>;
  state?: boolean;
}
