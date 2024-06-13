
export class Classdocum {

    class_id?: string;
    class_status?: boolean;
    unit_id?: string;
    startDate?: string;
    startTime?: string;
    toDate?: string;
    toTime?: string;
    className?: String;
    class_evaluation ?: Array<any>;
    class_notes?: Array<any>;
    class_resources ?: Array<any>;
    fromDate ?: String;
    is_start ?: Boolean;
    status ?: Boolean;
    constructor(classdocum: any) {
        this.class_id = classdocum.class_id;
        this.unit_id = classdocum.unit_id;
        this.class_status = classdocum.class_status;
        this.startDate = classdocum.startDate;
        this.startTime = classdocum.startTime;
        this.toDate = classdocum.toDate;
        this.toTime = classdocum.toTime;
        this.className = classdocum.className;
        this.class_evaluation = classdocum.class_evaluation;
        this.class_notes = classdocum.class_notes;
        this.class_resources = classdocum.class_resources;
        this.fromDate = classdocum.fromDate;
        this.is_start = classdocum.is_start;
        this.status = classdocum.status;
    }
}
