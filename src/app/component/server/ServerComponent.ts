import { DatePipe } from "@angular/common";
import bodyParser from "body-parser";
import express from "express";
import fs from "fs";
import http from "http";
import https from "https";
import path from "path";
import { CommonUtils } from "../../commons/CommonUtils";
import { RequestMetadata } from "../../pojo/RequestMetadata";
import { SystemUtils } from "./../../commons/SystemUtils";
import { Logger } from "./../../logging/Logger";
import { LoggingTracker } from "./../../logging/LoggingTracker";
import { ALL_CONTROLLERS, GET_CONTROLLERS, POST_CONTROLLERS } from "./ServerControllers";

export class ServerComponent {

    public static startServer(port: number): any {
        const application = express();

        application.use(ServerComponent.APP_REQUEST_INTERCEPTOR_FUNCTION);

        let requestMetadata: RequestMetadata;
        GET_CONTROLLERS.forEach((controller) => {
            requestMetadata = controller.requestMetadata;
            this.LOGGER.log(this.LOGGING_TRACKER_STARTUP, "Adding GET request[" + requestMetadata.path + "]");
            application.get(requestMetadata.path, requestMetadata.requestHandler);
        });

        POST_CONTROLLERS.forEach((controller) => {
            requestMetadata = controller.requestMetadata;
            this.LOGGER.log(this.LOGGING_TRACKER_STARTUP, "Adding POST request[" + requestMetadata.path + "]");
            application.post(requestMetadata.path, requestMetadata.requestHandler);
        });

        ALL_CONTROLLERS.forEach((controller) => {
            requestMetadata = controller.requestMetadata;
            this.LOGGER.log(this.LOGGING_TRACKER_STARTUP, "Adding ALL request[" + requestMetadata.path + "]");
            application.all(requestMetadata.path, requestMetadata.requestHandler);
        });

        application.all("*", ServerComponent.APP_REQUEST_UNKNOWN_URL_FUNCTION);

        //Not working :(
        //application.use(ServerComponent.APP_RESPONSE_INTERCEPTOR_FUNCTION);

        application.use(ServerComponent.APP_ERROR_FUNCTION);

        application.use(bodyParser.json());

        let server: any;

        if (SystemUtils.isHTTPSServerRequired()) {
            this.LOGGER.log(this.LOGGING_TRACKER_STARTUP, "Creating HTTPS server");
            this.LOGGER.log(this.LOGGING_TRACKER_STARTUP, "Current DIR:", process.cwd(), __dirname, path.delimiter);
            this.LOGGER.log(this.LOGGING_TRACKER_STARTUP, "Key path:", SystemUtils.appHTTPSKeyPath());
            this.LOGGER.log(this.LOGGING_TRACKER_STARTUP, "Cert path:", SystemUtils.appHTTPSCertPath());
            const privateKey = fs.readFileSync(SystemUtils.appHTTPSKeyPath(), "utf8");
            const certificate = fs.readFileSync(SystemUtils.appHTTPSCertPath(), "utf8");
            const credentials = { key: privateKey, cert: certificate };
            const serverHTTPS = https.createServer(credentials, application);
            server = serverHTTPS.listen(port);
        } else {
            this.LOGGER.log(this.LOGGING_TRACKER_STARTUP, "Creating HTTP server");
            const serverHTTP = http.createServer(application);
            server = serverHTTP.listen(port);
        }

        ServerComponent.printServerDetail(server);
        this.LOGGER.log(this.LOGGING_TRACKER_STARTUP, "Server:", CommonUtils.prettyPrintJSON(server));
        return true;
    }

    private static readonly LOGGER: Logger = Logger.getLogger("src/app/component/server/ServerComponent");
    private static readonly LOGGING_TRACKER_STARTUP: LoggingTracker = new LoggingTracker("ServerComponent - Startup");

    private static APP_CORRELATION_ID = "app-correlation-id";
    private static APP_AUTH_HEADER = "authorization";
    private static APP_AUTH_TOKEN_BUF_SECRET = new Buffer(SystemUtils.appHeaderAuthorizationTokenSecret(), "base64");
    private static DATE_PIPE: DatePipe = new DatePipe("en-US");

    private static APP_REQUEST_UNKNOWN_URL_FUNCTION = (req: any, res: any, next: any) => {
        ServerComponent.LOGGER.log(new LoggingTracker("ERROR"), "request received invalid URL");
        res.status(404).send("Invalid");
    }

    private static isAuthorized(req: any): boolean {
        const auth: string = req.headers[ServerComponent.APP_AUTH_HEADER];
        this.LOGGER.info(new LoggingTracker("AUTH_" + auth), "Auth:" + auth);
        //
        return false;
    }

    private static APP_REQUEST_INTERCEPTOR_FUNCTION = (req: any, res: any, next: any) => {
        const date: Date = new Date();
        const transformedDate: string | null = ServerComponent.DATE_PIPE.transform(date, "ddMMyyyy_HHmmss_S");
        let transformedDateString;
        if (transformedDate != null) {
            transformedDateString = transformedDate.toString();
        } else {
            transformedDateString = date.getTime().toString();
        }
        const correlationId: string = transformedDateString.toString();
        const loggingTracker: LoggingTracker = new LoggingTracker("REQUEST[" + correlationId + "]_" + req.url);
        ServerComponent.LOGGER.log(loggingTracker, "Before");
        ServerComponent.checkRequest(req, correlationId, loggingTracker);
        if (!ServerComponent.isAuthorized(req)) {
            ServerComponent.LOGGER.error(loggingTracker, "Invalid token");
            //res.send("Not authorized");
            //return;
        }
        next();
    }

    private static APP_RESPONSE_INTERCEPTOR_FUNCTION = (req: any, res: any, next: any) => {
        const correlationId: string = req.headers[ServerComponent.APP_CORRELATION_ID];
        const loggingTracker: LoggingTracker = new LoggingTracker("RESPONSE[" + correlationId + "]_" + req.url);
        ServerComponent.LOGGER.log(loggingTracker, "After");
        ServerComponent.checkResponse(req, res, req.headers[ServerComponent.APP_CORRELATION_ID], loggingTracker);
        ServerComponent.LOGGER.log(loggingTracker, CommonUtils.prettyPrintJSON(res));
        next();
    }

    private static APP_ERROR_FUNCTION = (err: any, req: any, res: any, next: any) => {
        const correlationId: string = req.headers[ServerComponent.APP_CORRELATION_ID];
        const loggingTracker: LoggingTracker = new LoggingTracker("ERROR[" + correlationId + "]_" + req.url);
        ServerComponent.LOGGER.error(loggingTracker,
            "Error occured[" + correlationId + "]", "sending appropriate response");
        ServerComponent.LOGGER.error(loggingTracker, CommonUtils.prettyPrintJSON(err));
        ServerComponent.checkResponse(req, res, correlationId, loggingTracker);
        res.status(500).send("Error occurred");
    }

    private static checkRequest(req: any, correlationId: string | null, loggingTracker: LoggingTracker): void {
        req.headers[ServerComponent.APP_CORRELATION_ID] = correlationId;
        req.res.set(ServerComponent.APP_CORRELATION_ID, correlationId);
        this.LOGGER.debug(loggingTracker, "Request:", correlationId, "[", req.method, "]",
            req.baseUrl, req.originalUrl, req.host, req.hostname);
        this.LOGGER.debug(loggingTracker, "Params", CommonUtils.prettyPrintJSON(req.params));
        this.LOGGER.debug(loggingTracker, "Query", CommonUtils.prettyPrintJSON(req.query));
        this.LOGGER.debug(loggingTracker, "Raw headers:", CommonUtils.prettyPrintJSON(req.rawHeaders));
        this.LOGGER.debug(loggingTracker, "Request headers:", CommonUtils.prettyPrintJSON(req.headers));
        this.LOGGER.debug(loggingTracker, "Body", req.body);
        this.LOGGER.debug(loggingTracker, "Request:", CommonUtils.prettyPrintJSONReduce(req));
    }

    private static checkResponse(
        req: any, res: any, correlationId: string | null, loggingTracker: LoggingTracker): void {
        this.LOGGER.log(loggingTracker, "Response:", correlationId, res.statusCode, res.headersSent);
    }

    private static printServerDetail(server: any): void {
        this.LOGGER.log(this.LOGGING_TRACKER_STARTUP, "Server started", server.family);
        const address = server.address();
        this.LOGGER.log(this.LOGGING_TRACKER_STARTUP, "Listening at https://" + address.address + ":" + address.port);
    }
}
