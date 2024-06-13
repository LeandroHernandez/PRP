export class Level {
    level_id?: string;
    level_name?: string;
    level_status?: boolean;
    constructor(level: any) {
        this.level_id = level.id;
        this.level_name = level.name;
        this.level_status = level.status;
    }
}
