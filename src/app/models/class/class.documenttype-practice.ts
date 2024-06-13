export class TypePractice {
    option_name?: string;
    option_type?: string;
    option_id?: string;
    option_description?: string;
    option_attached_required?: boolean;
    option_attached_multiple?: boolean;
    option_text_required?: boolean;
    question_image?: string
    options_attemps?: string;
    question_time?: String;
    question_scoring?: number;
    other_question_time?: number;
    useCount?: number;
    constructor(typePractice: any) {
        this.option_name = typePractice.option_name;
        this.option_type = typePractice.option_type;
        this.option_id = typePractice.option_id;
        this.option_description = typePractice.option_description;
        this.option_attached_required = typePractice.option_attached_required;
        this.option_attached_multiple = typePractice.option_attached_multiple;
        this.option_text_required = typePractice.option_text_required;
        this.question_image = typePractice.question_image;
        this.options_attemps = typePractice.options_attemps;
        this.question_scoring = typePractice.question_scoring;
        this.question_time = typePractice.question_time;
        this.other_question_time = typePractice.other_question_time;
    }
}
export class OptionOfItem {
    option_item_description?: string;
    option_item_order?: string;
    option_item_id?: string;
    option_item_is_correct?: boolean;
    option_item_image?: string;
    option_item_img_provisional?: any;
    option_scoring?: number;
    constructor(optionOfItem: any) {
        this.option_item_description = optionOfItem.option_item_name;
        this.option_item_order = optionOfItem.option_item_type;
        this.option_item_id = optionOfItem.option_item_id;
        this.option_item_is_correct = optionOfItem.option_item_is_correct;
        this.option_item_image = optionOfItem.option_item_image;
        this.option_item_img_provisional = optionOfItem.option_item_img_provisional;
        this.option_scoring = optionOfItem.option_scoring;
    }
}
