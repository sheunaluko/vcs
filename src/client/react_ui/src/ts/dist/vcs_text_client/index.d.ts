declare type data_field = string | number | boolean | object;
interface ws_msg {
    type: string;
    data: data_field;
}
interface c_ops {
    port: number | string;
    host: string;
    on_msg: (msg: ws_msg) => void;
    on_open?: () => void;
    reconnect?: number;
}
export declare class VCS_TEXT_CLIENT {
    conn: WebSocket | undefined;
    ops: c_ops;
    constructor(ops: c_ops);
    log(...args: [any?, ...any[]]): void;
    connect(): void;
    send(msg: object): void;
}
export {};
