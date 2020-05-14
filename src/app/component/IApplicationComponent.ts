export interface IApplicationComponent<JOB> {
    name: string;
    isValid(): boolean;
    start(): boolean;
    getComponentJob(): JOB;
}
