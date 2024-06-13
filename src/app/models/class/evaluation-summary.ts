export class EvaluationSummary {
    date?:any;
    totalScore?: number;
    totalTime?: number;
    evaluationData?: Object;
    startTime?: any;
    endTime?: any;
    evaluationStatus?: Boolean;
    evaluationId?: String;
    intents?: number;
    constructor(evaluation: any) {
        this.date = evaluation.date;
        this.totalScore = evaluation.totalScore;
        this.totalTime = evaluation.totalTime;
        this.evaluationData = evaluation.evaluationData;
        this.startTime = evaluation.startTime;
        this.endTime = evaluation.endTime;
        this.evaluationStatus = evaluation.evaluationStatus;
        this.evaluationId = evaluation.evaluationId;
        this.intents = evaluation.intents;

    }
}
