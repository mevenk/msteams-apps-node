import { DateUtils } from "./../commons/DateUtils";

export class LoggingTracker {

    public static generateTrackingId(id: number | string): string {
        return id + "_" + DateUtils.nowInMillis();
    }

    public static generateLoggingTracker(id: number | string): LoggingTracker {
        return new LoggingTracker(this.generateTrackingId(id));
    }

    constructor(private trackingId: string, private trackers: Map<string, string | number> = new Map()) {
        this.trackingId = trackingId;
        this.trackers = trackers;
    }

    public generateTracker(): string {
        let tracker: string = "[ TrackingId=" + this.trackingId;
        this.trackers.forEach((value: string | number, key: string, map: Map<string, string | number>) => {
            tracker += ", " + key + "=" + value;
        });
        tracker += " ]";
        return tracker;
    }

}
