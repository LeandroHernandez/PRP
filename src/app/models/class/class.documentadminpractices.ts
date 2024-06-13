export class Adminpractices {
    subject_id?: String;
    grade_id?: String;
    practice_id?: String;
    practice_name?: String;
    practice_type?: String;
    public_status_practice?: Boolean;
    public_status_practice_educational_unit?: Boolean;
    teacher_id?: String;
    unit_educational_id_from_teacher?: String;
    test_type?: String;
    evaluation_id?: String;
    evaluation_scoring?: number;
    evaluation_name?: String;
    essay_id?: String;
    essay_name?: String;
    essay_scoring?: Number;

    constructor(practice: any) {
        this.subject_id = practice.subject_id;
        this.grade_id = practice.grade_id;
        this.practice_id = practice.practice_id;
        this.practice_name = practice.practice_name;
        this.practice_type = practice.practice_type;
        this.public_status_practice = practice.public_status_practice;
        this.public_status_practice_educational_unit = practice.public_status_practice_educational_unit;
        this.teacher_id = practice.teacher_id;
        this.unit_educational_id_from_teacher = practice.unit_educational_id_from_teacher;
        this.evaluation_id = practice.evaluation_id;
        this.evaluation_scoring = practice.evaluation_scoring;
        this.evaluation_name = practice.evaluation_name;
        this.test_type = practice.test_type;
        this.essay_id = practice.essay_id;
        this.essay_name = practice.essay_name;
        this.essay_scoring = practice.essay_scoring;
    }

}
