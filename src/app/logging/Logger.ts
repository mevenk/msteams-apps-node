import { DatePipe } from "@angular/common";
import { CommonUtils } from "../commons/CommonUtils";
import { LoggingTracker } from "./LoggingTracker";
import { LogType } from "./LogType";

export class Logger {

    public static getLogger(entity: string): Logger {
        return new Logger(entity);
    }

    private static DATE_PIPE: DatePipe = new DatePipe("en-US");

    private static logDate(): string {
        return Logger.DATE_PIPE.transform(new Date(), "dd/MM/yyyy HH:mm:ss.SSS") + ":";
    }

    private static generateLoggingDataPrefix(
        logger: Logger, logType: LogType,
        loggingTracker: LoggingTracker = new LoggingTracker(LoggingTracker.generateTrackingId("track"))): string {
        let loggingDataString: string = Logger.logDate().concat(" ", LogType[logType], " ", logger.entity);
        loggingDataString += loggingTracker.generateTracker();
        return loggingDataString;
    }

    private static doLog(logType: LogType, logger: Logger, loggingData: any[], loggingTracker?: LoggingTracker): void {

        let loggingDataString = this.generateLoggingDataPrefix(logger, logType, loggingTracker);

        if (!CommonUtils.isUndefined(loggingData)) {
            for (const element of loggingData) {
                loggingDataString += " :: " + element;
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

    private constructor(private entity: string) {
        this.entity = entity;
    }

    public log(loggingTracker?: LoggingTracker, ...loggingData: any): void {
        Logger.doLog(LogType.LOG, this, loggingData, loggingTracker);
    }

    public info(loggingTracker?: LoggingTracker, ...loggingData: any): void {
        Logger.doLog(LogType.INFO, this, loggingData, loggingTracker);
    }

    public debug(loggingTracker?: LoggingTracker, ...loggingData: any): void {
        Logger.doLog(LogType.DEBUG, this, loggingData, loggingTracker);
    }

    public warn(loggingTracker?: LoggingTracker, ...loggingData: any): void {
        Logger.doLog(LogType.WARN, this, loggingData, loggingTracker);
    }

    public error(loggingTracker?: LoggingTracker, ...loggingData: any): void {
        Logger.doLog(LogType.ERROR, this, loggingData, loggingTracker);
    }

    public trace(loggingTracker?: LoggingTracker, ...loggingData: any): void {
        Logger.doLog(LogType.TRACE, this, loggingData, loggingTracker);
    }

}
