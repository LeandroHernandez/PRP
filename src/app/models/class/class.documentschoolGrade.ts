export class SchoolGrade {
    grade_id?: string;
    grade_name?: string;
    grade_status?: boolean;
    level_id?: string;
    level_name?: string;
    sublevel_id?: string
    sublevel_name?: string;
    constructor(grade: any) {
        this.grade_id = grade.id;
        this.grade_name = grade.name;
        this.grade_status = grade.status;
        this.level_id = grade.level_id;
        this.sublevel_id = grade.sublevel_id;
        this.level_name = grade.level_name;
        this.sublevel_name = grade.sublevel_name;
    }
}
