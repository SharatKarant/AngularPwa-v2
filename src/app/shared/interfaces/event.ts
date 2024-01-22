export interface Event {
    eventData:EventData
}

export interface EventData{
    id: string;
    name: string;
    date: string;
    startTime: string;
    endTime: string;
    description: string;
}

