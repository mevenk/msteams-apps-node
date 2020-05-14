import { CronCommand } from "cron";
import { ApplicationCronJob } from "../../component/cron/ApplicationCronJob";
import { CronComponent } from "../../component/cron/CronComponent";
import { Logger } from "../../logging/Logger";
import { DateUtils, TimeUnit } from "./../../commons/DateUtils";
import { HTTPRequest } from "./../../commons/http/HTTPRequest";

export class ServiceStatusPolling extends CronComponent {

    private static waitTimeInMinutesForFailCheck: number = 0;

    private static services = new Map<IServiceMetadata, number>();

    private static FUNCTION: CronCommand = () => {
        Logger.log("Service status polling.....");

        ServiceStatusPolling.services.forEach((lastFail: number, service: IServiceMetadata) => {
            if (lastFail !== -1 && DateUtils.differnceFromNow(lastFail, TimeUnit.MINUTES) <
                ServiceStatusPolling.waitTimeInMinutesForFailCheck) {
                Logger.info("Fail time wait.......");
            } else {
                Logger.info("Verifying", service.name);
                const status: number = new HTTPRequest(service.url, "GET").getStatus();
                const success: boolean = HTTPRequest.isStatusSuccess(status);
                Logger.info("success?", success, "status:", status);
                lastFail = success ? -1 : DateUtils.nowInMillis();
            }
        });
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
