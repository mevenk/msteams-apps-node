import { CronJob } from "cron";
import { LoggingTracker } from "../../logging/LoggingTracker";
import { IApplicationComponent } from "../IApplicationComponent";
import { Logger } from "./../../logging/Logger";
import { ApplicationCronJob } from "./ApplicationCronJob";

export class CronComponent implements IApplicationComponent<ApplicationCronJob> {

    public static CRON_EXPRESSION_EVERY_SECOND: string = "* * * * * *";
    public static CRON_EXPRESSION_EVERY_MINUTE: string = "* * * * *";

    private static readonly LOGGER_CRON: Logger = Logger.getLogger("src/app/component/cron/CronComponent");
    private static readonly LOGGING_TRACKER_CRON: LoggingTracker = new LoggingTracker("CronComponent");

    private static NO_OF_JOBS: number = 0;

    public name: string = "Cron component";

    public constructor(private applicationCronJob: ApplicationCronJob) {
    }

    public isValid(): boolean {
        // Nothing to validate
        return true;
    }

    public getComponentJob(): ApplicationCronJob {
        return this.applicationCronJob;
    }
    public start(): boolean {
        CronComponent.LOGGER_CRON.info(CronComponent.LOGGING_TRACKER_CRON, "Starting:", this.applicationCronJob.name);
        const cronJob: CronJob = this.applicationCronJob.cronJob;
        cronJob.start();
        CronComponent.NO_OF_JOBS++;
        CronComponent.LOGGER_CRON.info(CronComponent.LOGGING_TRACKER_CRON, "No of jobs:", CronComponent.NO_OF_JOBS);
        return true;
    }

}
