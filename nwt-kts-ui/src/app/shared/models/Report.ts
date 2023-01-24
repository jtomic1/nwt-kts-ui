import { ReportType } from "./enums/ReportType";

export interface Report {
    reportType: ReportType,
    userId: number,
    start: string,
    end: string   
}