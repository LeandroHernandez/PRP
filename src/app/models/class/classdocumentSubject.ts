export class Subject {
    subject_id?: string;
    subject_cod?: string;
    subject_name?: string;
    subject_status?: boolean;
    area_acad_id?: string;
    level_id?: string;
    sublevel_id?: string;
    area_acad_name?: string;
    level_name?: string;
    sublevel_name?: string;
    grade_id?: string;
    grade_name?: string;
    parallel_id?: string;
    parallel_name?: string;
    color?: string;
    icon?: string;
    sizeClase?: boolean;
    constructor (subject: any) {
        this.subject_id = subject.subject_id;
        this.subject_cod = subject.subject_cod;
        this.subject_name = subject.subject_name;
        this.subject_status = subject.subject_status;
        this.area_acad_id = subject.area_acad_id;
        this.level_id = subject.level_id;
        this.sublevel_id = subject.sublevel_id;
        this.area_acad_name = subject.area_acad_name;
        this.level_name = subject.level_name;
        this.sublevel_name = subject.sublevel_name;
        this.grade_id = subject.grade_id;
        this.parallel_id = subject.parallel_id;
        this.grade_name = subject.grade_name;
        this.parallel_name = subject.parallel;
        this.color = subject.color;
        this.icon = subject.icon;

    }

}
