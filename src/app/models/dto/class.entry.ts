export class Entry {
    id:string;
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
    completed?: boolean;
    numberOfError?: number;
    numberOfAttemps?: number;
}
