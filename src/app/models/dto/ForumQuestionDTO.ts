import {DocumentForumAnswer} from '../class/class.documentforoanswer';

export class ForumQuestionDTO {

    public question_id: string;
    public question: string;
    public id_user_creator: string;
    public question_date: string;
    public question_time: string;
    public user_type: string;
    public question_status: boolean;
    public studentAnswersList: string[];
    public documentForumAnswerList: DocumentForumAnswer[];
    public documentForumBestAnswer: DocumentForumAnswer;

    constructor() {
    }

}
