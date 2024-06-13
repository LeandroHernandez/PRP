export class Rubric {
  rubric_id?: string;
  rubric_name?: string;
  rubric_des?: string;
  rubric_calification?: number;

  constructor(rubric?: any) {
    this.rubric_id = rubric && rubric.rubric_id || new Date().getTime().toString();
    this.rubric_name = rubric && rubric.rubric_name || '';
    this.rubric_des = rubric && rubric.rubric_des || '';
    this.rubric_calification = rubric && rubric.rubric_calification || 0;
  }
}

export class RubricJudgement {
  rubric_judgement_id: string;
  rubric_judgement_des: string;
  rubric_judgement_items: RubricJudgementItem[];

  constructor(item?: any) {
    this.rubric_judgement_id = item && item.rubric_judgement_id || new Date().getTime().toString();
    this.rubric_judgement_des = item && item.rubric_judgement_des || '';
    this.rubric_judgement_items = item && item.rubric_judgement_items || [];
  }
}

export class RubricPoint {
  rubric_point_id: string;
  rubric_point_calification: number;

  constructor(item?: any) {
    this.rubric_point_id = item && item.rubric_point_id || new Date().getTime().toString();
    this.rubric_point_calification = item && item.rubric_point_calification || 0;
  }
}

export class RubricJudgementItem {
  rubric_judgement_item_id: string;
  rubric_judgement_item_des: string;
  rubric_judgement_item_calification: number;
  selected: boolean;

  constructor(item?: any) {
    this.rubric_judgement_item_id = item && item.rubric_judgement_item_id || new Date().getTime().toString();
    this.rubric_judgement_item_des = item && item.rubric_judgement_item_des || '';
    this.rubric_judgement_item_calification = item && item.rubric_judgement_item_calification || 0;
  }
}
