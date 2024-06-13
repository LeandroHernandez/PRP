import {StudentScoreComponentDetailDTO} from './StudentScoreComponentDetailDTO';

export class StudentScoreClassDetailDTO {
    classID: string;
    scorePercentage: number;
    scorePercentageObtained: number;
    studentComponentScoreList: StudentScoreComponentDetailDTO[];
}
