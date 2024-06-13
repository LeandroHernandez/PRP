
export class Resourcesdocum {

    resource_id?: string;
    resource_id_original?: string;
    resource_name?: string;
    resource_status?: boolean;
    resource_type?: string;
    startDate?: string;
    startTime?: string;
    toDate?: string;
    toTime?: string;
    intents?: number;
    time_spend?: string;
    class_id?: string;
    completed?: boolean;

    constructor(resourcesdocum: any) {
        this.resource_name = resourcesdocum.resource_name;
        this.resource_status = resourcesdocum.resource_status;
        this.resource_type = resourcesdocum.resource_type;
        this.startDate = resourcesdocum.startDate;
        this.startTime = resourcesdocum.startTime;
        this.toDate = resourcesdocum.toDate;
        this.toTime = resourcesdocum.toTime;
        this.intents = resourcesdocum.intents;
        this.time_spend = resourcesdocum.time_spend;
        this.class_id = resourcesdocum.class_id;
        this.resource_id = resourcesdocum.resource_id;
        this.completed = resourcesdocum.completed;
    }
}
