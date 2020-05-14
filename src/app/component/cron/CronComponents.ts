import { ServiceStatusPolling } from "../../module/polling/ServiceStatusPolling";
import { CronComponent } from "./CronComponent";

export const CRON_COMPONENTS: CronComponent[] = [new ServiceStatusPolling()];
