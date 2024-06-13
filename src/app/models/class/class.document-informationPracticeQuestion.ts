export class InformationPracticeQuestion {
    numberOfattempts ?: Number;
    numberOfErrors ?: Number;
    hour ?: any;
    date ?: String;
    time ?: any;
    startTime ?: any;
    endTime ?: any;
    questionId ?: String;
    practiceId?: String;
    practiceAttemptsId?: String;
    textReply ?: String;
    wrongAnswerPosition ?: any;
    questionInformation ?: Array<Object>;
    constructor(infoPracticeQuestion: any) {
        this.numberOfattempts = infoPracticeQuestion.numberOfattempts ;
        this.numberOfErrors = infoPracticeQuestion.numberOfErrors;
        this.hour = infoPracticeQuestion.hour;
        this.date = infoPracticeQuestion.date;
        this.time = infoPracticeQuestion.time;
        this.startTime = infoPracticeQuestion.startTime;
        this.endTime = infoPracticeQuestion.endTime;
        this.questionId = infoPracticeQuestion.questionId;
        this.practiceAttemptsId = infoPracticeQuestion.practiceAttemptsId;
        this.textReply = infoPracticeQuestion.textReply;
        this.wrongAnswerPosition = infoPracticeQuestion.wrongAnswerPosition;
        this.questionInformation = infoPracticeQuestion.questionInformation;

    }

}
export class InformationEvaluationQuestion {
    numberOfCorrect ?: Number;
    numberOfErrors ?: Number;
    hour ?: any;
    date ?: String;
    time ?: any;
    startTime ?: any;
    questionId ?: String;
    evaluationId?: String;
    answers ?: Array<Object>;
    questionOptions?: Object;
    question?: Object;
    score ?: number;
    constructor(infoEvaluationQuestion: any) {
        this.numberOfCorrect = infoEvaluationQuestion.numberOfattempts ;
        this.numberOfErrors = infoEvaluationQuestion.numberOfErrors;
        this.hour = infoEvaluationQuestion.hour;
        this.date = infoEvaluationQuestion.date;
        this.time = infoEvaluationQuestion.time;
        this.startTime = infoEvaluationQuestion.startTime;
        this.questionId = infoEvaluationQuestion.questionId;
        this.answers = infoEvaluationQuestion.answers;
        this.questionOptions= infoEvaluationQuestion.questionInformation;
        this.score = infoEvaluationQuestion.score;
        this.question = infoEvaluationQuestion.question;
    }

}
