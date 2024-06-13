export class SubLevels {
    sublevel_id?: string;
    sublevel_name?: string;
    sublevel_status?: boolean
    level_id?: string;
    level_name?: string;
    constructor(sublevel: any) {
        this.sublevel_id = sublevel.id;
        this.sublevel_name = sublevel.name;
        this.sublevel_status = sublevel.status;
        this.level_id = sublevel.level_id;
        this.level_name = sublevel.level_name;
    }
}
