import { DatePipe } from "@angular/common";
import { CommonUtils } from "../commons/CommonUtils";
import { LogType } from "./LogType";

export class Logger {

    public static log(...loggingData: any): void {
        Logger.doLog(LogType.LOG, loggingData);
    }

    public static info(...loggingData: any): void {
        Logger.doLog(LogType.INFO, loggingData);
    }

    public static debug(...loggingData: any): void {
        Logger.doLog(LogType.DEBUG, loggingData);
    }

    public static warn(...loggingData: any): void {
        Logger.doLog(LogType.WARN, loggingData);
    }

    public static error(...loggingData: any): void {
        Logger.doLog(LogType.ERROR, loggingData);
    }

    public static trace(...loggingData: any): void {
        Logger.doLog(LogType.TRACE, loggingData);
    }

    private static DATE_PIPE: DatePipe = new DatePipe("en-US");

    private static logDate(): string {
        return Logger.DATE_PIPE.transform(new Date(), "d/M/y H:m:s.S") + ": ";
    }

    private static doLog(logType: LogType, loggingData: any[]): void {

        let loggingDataString = Logger.logDate();

        if (!CommonUtils.isUndefined(loggingData)) {
            for (const element of loggingData) {
                loggingDataString += " " + element;
            }
        }

        switch (logType) {
            case LogType.LOG:
                Logger.consoleLog(loggingDataString);
                break;

            case LogType.INFO:
                Logger.consoleInfo(loggingDataString);
                break;

            case LogType.DEBUG:
                Logger.consoleDebug(loggingDataString);
                break;

            case LogType.WARN:
                Logger.consoleWarn(loggingDataString);
                break;

            case LogType.ERROR:
                Logger.consoleError(loggingDataString);
                break;

            case LogType.TRACE:
                Logger.consoleTrace(loggingDataString);
                break;

            default:
                Logger.consoleLog(loggingDataString);
                break;
        }

    }

    private static consoleLog(loggingData: string): void {
        console.log(loggingData);
    }

    private static consoleInfo(loggingData: string): void {
        console.info(loggingData);
    }

    private static consoleDebug(loggingData: string): void {
        console.debug(loggingData);
    }

    private static consoleWarn(loggingData: string): void {
        console.warn(loggingData);
    }

    private static consoleError(loggingData: string): void {
        console.error(loggingData);
    }

    private static consoleTrace(loggingData: any): void {
        console.trace(loggingData);
    }

}
