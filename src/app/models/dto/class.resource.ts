import {Entry} from './class.entry';

export class Resource {
    class_id: string;
    intents: number;
    resource_id: string;
    resource_name: string;
    resource_status: boolean;
    resource_type: string;
    startDate: string;
    startTime: string;
    time_spend: string;
    toDate: string;
    toTime: string;
    entryList: Entry[];
    date?: string;
    totalTime?: string;
    totalScore?: number;
    evaluationData?: Array<Object>;
    intentId?: String;
}
