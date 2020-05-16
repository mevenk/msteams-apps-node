import { CronCommand } from "cron";
import { ApplicationCronJob } from "../../component/cron/ApplicationCronJob";
import { CronComponent } from "../../component/cron/CronComponent";
import { Logger } from "../../logging/Logger";
import { LoggingTracker } from "../../logging/LoggingTracker";
import { DateUtils, TimeUnit } from "./../../commons/DateUtils";
import { HTTPRequest, IHTTPResponse } from "./../../commons/http/HTTPRequest";

export class ServiceStatusPolling extends CronComponent {

    private static readonly LOGGER: Logger = Logger.getLogger("src/app/module/polling/ServiceStatusPolling");

    private static waitTimeInMinutesForFailCheck: number = 0;

    private static services = new Map<IServiceMetadata, number>();

    private static generateLoggingTracker(service: IServiceMetadata): LoggingTracker {
        const logTracker: Map<string, string> = new Map();
        logTracker.set("Name", service.name);
        const loggingTracker: LoggingTracker = new LoggingTracker(
            LoggingTracker.generateTrackingId("ServiceStatusPolling"), logTracker);
        return loggingTracker;
    }

    private static FUNCTION: CronCommand = () => {
        ServiceStatusPolling.LOGGER.log(new LoggingTracker("ServiceStatusPolling"), "Service status polling.....");

        ServiceStatusPolling.services.forEach((lastFail: number, service: IServiceMetadata) => {
            const loggingTracker: LoggingTracker = ServiceStatusPolling.generateLoggingTracker(service);
            if (lastFail !== -1 && DateUtils.differnceFromNow(lastFail, TimeUnit.MINUTES) <
                ServiceStatusPolling.waitTimeInMinutesForFailCheck) {
                ServiceStatusPolling.LOGGER.info(loggingTracker, "Fail time wait.......");
            } else {
                ServiceStatusPolling.LOGGER.info(loggingTracker, "Verifying", service.name);
                let responseReceived: IHTTPResponse<string>;
                let responseStatus: number;
                let responseSuccess: boolean;
                new HTTPRequest<undefined, string>(service.url, "GET").getResponse()
                    .then((response: IHTTPResponse<string>) => {
                        responseReceived = response;
                        responseStatus = responseReceived.status;
                        responseSuccess = HTTPRequest.isStatusSuccess(responseStatus);
                    })
                    .catch((error: any) => {
                        ServiceStatusPolling.LOGGER.error(loggingTracker, error);
                        responseSuccess = false;
                    })
                    .finally(() => {
                        lastFail = responseSuccess ? -1 : DateUtils.nowInMillis();
                        ServiceStatusPolling.LOGGER.info(loggingTracker, "success?",
                            responseSuccess, "status:", responseStatus, "Last fail:", lastFail);
                    });
            }
        });
        //Send Email
    }

    private static updateData(): void {
        //To be fetched from MongoDB
        const servicesFromDB = [{ name: "Google", url: "https://www.google.com" }, { name: "Outlook", url: "https://www.outlook.com" }];
        servicesFromDB.forEach((service) => {
            this.services.set(service, -1);
        });
        this.waitTimeInMinutesForFailCheck = 0.25;
    }

    constructor() {
        ServiceStatusPolling.updateData();
        const serviceName: string = "Services status polling";
        const expression: string = CronComponent.CRON_EXPRESSION_EVERY_MINUTE;
        super(new ApplicationCronJob(serviceName, expression, ServiceStatusPolling.FUNCTION));
    }

}

interface IServiceMetadata {
    name: string;
    url: string;
}
