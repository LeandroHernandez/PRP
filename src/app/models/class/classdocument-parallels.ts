export class Parallels {
    parallel_id?: string;
    parallel_name?: string;
    parallel_status?: boolean;
    level_id?: string;
    level_name?: string;
    sublevel_id?: string;
    sublevel_name?: string;
    grade_id?: string;
    grade_name?: string;
    parallel_subject_id?: any;
    constructor(parallel: any) {
        this.parallel_id = parallel.parallel_id;
        this.parallel_name = parallel.parallel_name;
        this.parallel_status = parallel.parallel_status;
        this.level_id = parallel.level_id;
        this.sublevel_id = parallel.sublevel_id;
        this.grade_id = parallel.grade_id;
        this.level_name = parallel.level_name;
        this.sublevel_name = parallel.sublevel_name;
        this.grade_name = parallel.grade_name;
        this.parallel_subject_id = parallel.parallel_subject_id;

}

}
