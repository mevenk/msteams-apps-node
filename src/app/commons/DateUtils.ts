import { add, differenceInDays, differenceInHours, differenceInMilliseconds, differenceInMinutes, differenceInMonths, differenceInSeconds, differenceInWeeks, differenceInYears, sub } from "date-fns";

export class DateUtils {

    public static now(): Date {
        return new Date();
    }

    public static nowInMillis(): number {
        return this.now().getTime();
    }

    public static differnce(dateLeft: Date | number, dateRight: Date | number, timeUnit: TimeUnit): number {
        let diff = -1;
        switch (timeUnit) {
            case TimeUnit.MILLIS:
                diff = differenceInMilliseconds(dateLeft, dateRight);
                break;
            case TimeUnit.SECONDS:
                diff = differenceInSeconds(dateLeft, dateRight);
                break;
            case TimeUnit.MINUTES:
                diff = differenceInMinutes(dateLeft, dateRight);
                break;
            case TimeUnit.HOURS:
                diff = differenceInHours(dateLeft, dateRight);
                break;
            case TimeUnit.DAYS:
                diff = differenceInDays(dateLeft, dateRight);
                break;
            case TimeUnit.WEEKS:
                diff = differenceInWeeks(dateLeft, dateRight);
                break;
            case TimeUnit.MONTHS:
                diff = differenceInMonths(dateLeft, dateRight);
                break;
            case TimeUnit.YEARS:
                diff = differenceInYears(dateLeft, dateRight);
                break;
        }
        return diff;
    }

    public static differnceFromNow(date: Date | number, timeUnit: TimeUnit): number {
        return this.differnce(this.now(), date, timeUnit);
    }

    public static add(date: Date | number, timeDuration: ITimeDuration[]): Date {
        return add(date, this.generateDuration(timeDuration));
    }

    public static addFromNow(timeDuration: ITimeDuration[]): Date {
        return this.add(this.now(), timeDuration);
    }

    public static subtract(date: Date | number, timeDuration: ITimeDuration[]): Date {
        return sub(date, this.generateDuration(timeDuration));
    }

    public static subtractFromNow(timeDuration: ITimeDuration[]): Date {
        return this.subtract(this.now(), timeDuration);
    }

    private static generateDuration(timeDuration: ITimeDuration[]): Duration {
        const duration: Duration = {};
        for (const time of timeDuration) {
            switch (time.timeUnit) {
                case TimeUnit.MILLIS:
                    duration.seconds = time.quantity * 1000;
                    break;
                case TimeUnit.SECONDS:
                    duration.seconds = time.quantity;
                    break;
                case TimeUnit.MINUTES:
                    duration.minutes = time.quantity;
                    break;
                case TimeUnit.HOURS:
                    duration.hours = time.quantity;
                    break;
                case TimeUnit.DAYS:
                    duration.days = time.quantity;
                    break;
                case TimeUnit.WEEKS:
                    duration.weeks = time.quantity;
                    break;
                case TimeUnit.MONTHS:
                    duration.months = time.quantity;
                    break;
                case TimeUnit.YEARS:
                    duration.years = time.quantity;
                    break;
            }
        }
        return duration;
    }

}

export enum TimeUnit {
    YEARS, MONTHS, WEEKS, DAYS, HOURS, MINUTES, SECONDS, MILLIS,
}

export interface ITimeDuration {
    timeUnit: TimeUnit;
    quantity: number;
}
