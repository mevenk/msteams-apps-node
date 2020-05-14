import { CRON_COMPONENTS } from "./../component/cron/CronComponents";
import { IApplicationComponent } from "./../component/IApplicationComponent";

export class ApplicationComponents {

    public static getApplicationComponents(): Array<IApplicationComponent<any>> {
        const applicationComponents: Array<IApplicationComponent<any>> = new Array();
        CRON_COMPONENTS.forEach((cronComponent) => { applicationComponents.push(cronComponent); });
        return applicationComponents;

    }

}
