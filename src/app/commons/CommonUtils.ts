export class CommonUtils {

    public static isUndefined(entity: any): boolean {
        return entity === undefined;
    }

    public static prettyPrintJSON(json: any): string {
        return JSON.stringify(json, null, "    ");
    }

}
