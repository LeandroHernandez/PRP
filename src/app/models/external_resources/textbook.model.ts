export class TextBook {
    competencies?: string;
    grade_name?: string;
    id_grade?: string;
    id_subject?: string;
    subject_name?: string;
    textbook_title?: string;
    type?: string;
    url?: string;

    constructor(textBookData: any) {
        this.competencies = textBookData.competencies;
        this.grade_name = textBookData.grade_name;
        this.id_grade = textBookData.id_grade;
        this.id_subject = textBookData.id_subject;
        this.subject_name = textBookData.subject_name;
        this.textbook_title = textBookData.textbook_title;
        this.type = textBookData.type;
        this.url = textBookData.url;
    }
}
