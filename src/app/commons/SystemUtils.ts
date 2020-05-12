import { APPLICATION_ENV_PROPERTIES } from "./ApplicationEnvProperties";

export class SystemUtils {

    public static getEnv(): any {
        return SystemUtils.ENV;
    }

    public static env(key: string): any {
        return SystemUtils.getEnv()[key];
    }

    public static username(): any {
        return SystemUtils.env("USERNAME");
    }

    public static applicationEnvironment(): any {
        return SystemUtils.env(APPLICATION_ENV_PROPERTIES.APP_ENV);
    }

    public static isHTTPSServerRequired(): boolean {
        return JSON.parse(SystemUtils.env(APPLICATION_ENV_PROPERTIES.APP_HTTPS_REQUIRED));
    }

    public static appHTTPSKeyPath(): string {
        return SystemUtils.env(APPLICATION_ENV_PROPERTIES.APP_HTTPS_KEY_PATH);
    }

    public static appHTTPSCertPath(): string {
        return SystemUtils.env(APPLICATION_ENV_PROPERTIES.APP_HTTPS_CERT_PATH);
    }

    public static applicationPort(): number {
        return SystemUtils.env(APPLICATION_ENV_PROPERTIES.APP_PORT);
    }

    public static appHeaderAuthorizationTokenSecret(): any {
        return SystemUtils.env(APPLICATION_ENV_PROPERTIES.APP_HEADER_AUTHORIZATION_TOKEN_SECRET);
    }

    private static ENV: any = process.env;

}
