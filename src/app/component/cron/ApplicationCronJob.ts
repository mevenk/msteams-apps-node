import Cron, { CronCommand } from "cron";
import { IApplicationCronJobMetaData } from "./IApplicationCronJobMetaData";

export class ApplicationCronJob implements IApplicationCronJobMetaData {

    constructor(public name: string, private cronTime: string, private cronCommand: CronCommand) {

    }

    public get cronJob(): Cron.CronJob { return new Cron.CronJob(this.cronTime, this.cronCommand); }
}
