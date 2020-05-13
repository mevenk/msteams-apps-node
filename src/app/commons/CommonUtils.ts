import fastSafeStringify from "fast-safe-stringify";

export class CommonUtils {

    public static isUndefined(entity: any): boolean {
        return entity === undefined;
    }

    public static prettyPrintJSON(json: any): string {
        return fastSafeStringify(json, undefined, 4);
    }

    public static prettyPrintJSONReduceTo(json: any, end: number): string {
        return CommonUtils.prettyPrintJSON(json).substring(0, end).concat(" ..........");
    }

    public static prettyPrintJSONReduce(json: any): string {
        return CommonUtils.prettyPrintJSONReduceTo(json, 1000);
    }
}
