import {WeightComponentsObjectDTO} from './WeightComponentsObjectDTO';

export class WeightClassObjectDTO {
    classID: string;
    className: string;
    classComponentWeightSum: number;
    weightComponentsObjectDTOList: WeightComponentsObjectDTO[]
}
