export class Academyareadocum {
    academyarea_id?: string;
    academyarea_cod?: string;
    academyarea_name?: string;
    academyarea_state?: boolean;
    level_id?: string;
    sublevel_id?: string;
    level_name?: string;
    sublevel_name?: string;

    constructor(academyAreaDocum: any) {
        this.academyarea_cod = academyAreaDocum.cod;
        this.academyarea_id = academyAreaDocum.id;
        this.academyarea_name = academyAreaDocum.name;
        this.academyarea_state = academyAreaDocum.state;
        this.level_id = academyAreaDocum.level_id;
        this.sublevel_id = academyAreaDocum.sublevel_id;
        this.level_name = academyAreaDocum.level_name;
        this.sublevel_name = academyAreaDocum.sublevel_name;
    }
}

