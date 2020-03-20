export class EmailLog {
    EmailLogId: number;
    SurveySelectorId: number;
    Email: string;
    Subject: string;
    Body: string;
    Status: string;
    Error: string;
    TriedCount: number;
    IsDeleted: boolean;
}