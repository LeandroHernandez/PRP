export class Resource {
    resource_id?: string;
    resource_name: string;
    resource_des?: string;
    resource_type: string
    resource_url: string;
    resource_status: boolean;
    resource_rubric: boolean;

    constructor() {
        this.resource_id = '';
        this.resource_name = '';
        this.resource_des = '';
        this.resource_type = '';
        this.resource_url = '';
        this.resource_status = true;
        this.resource_rubric = true;
    }
}
export class Evaluation {
  evaluation_id?: string;
  evaluation_name: string;
  evaluation_des?: string;
  evaluation_type: string
  evaluation_url: string;
  evaluation_status: boolean;
  evaluation_peso?: string;

  constructor() {
    this.evaluation_id = '';
    this.evaluation_name = '';
    this.evaluation_des = '';
    this.evaluation_type = '';
    this.evaluation_url = '';
    this.evaluation_status = true;
    this.evaluation_peso = '';
  }
}
