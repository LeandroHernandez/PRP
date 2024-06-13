import {StudentScoreClassDetailDTO} from './StudentScoreClassDetailDTO';

export class StudentScoreUnitDetailDTO {
    unitID: string;
    scorePercentage: number;
    scorePercentageObtained: number;
    unitDomain: number;
    unitWeight: number;
    studentClassScoreList: StudentScoreClassDetailDTO[];

}
