export type OnAbort = null | ((this: AbortSignal, event: Event) => any);

export function combineSignals(...signals: Array<AbortSignal>): AbortSignal {
    // const et = new EventTarget();
    // for (const signal of signals) {
    //     signal.addEventListener("abort", (evt) => {
    //         console.log("ABORT CALLED");
    //         et.dispatchEvent(evt);
    //     });
    // }
    let sharedOnAbort: OnAbort = null;
    return {
        get aborted(): boolean {
            return signals.some(signal => signal.aborted);
        },
        get reason(): any {
            return signals.find(signal => !!signal.reason)?.reason;
        },
        get onabort(): OnAbort {
            return sharedOnAbort;
        },
        set onabort(onAbort: OnAbort) {
            sharedOnAbort = onAbort;
            for (const signal of signals) {
                signal.onabort = sharedOnAbort;
            }
        },
        // Methods:
        addEventListener: (
            type: string,
            callback: EventListenerOrEventListenerObject,
            options?: AddEventListenerOptions | boolean
        ): void => {
            // et.addEventListener(type, callback, options);
            for (const signal of signals) {
                signal.addEventListener(type, callback, options);
            }
        },
        dispatchEvent: (event: Event): boolean => {
            // return et.dispatchEvent(event);
            return signals.some(signal => signal.dispatchEvent(event));
        },
        removeEventListener: (type: string, callback: EventListenerOrEventListenerObject, options?: EventListenerOptions | boolean): void => {
            // et.removeEventListener(type, callback, options);
            for (const signal of signals) {
                signal.removeEventListener(type, callback, options);
            }
        },
        throwIfAborted: (): void => {
            for (const signal of signals) {
                signal.throwIfAborted();
            }
        }
    };
}
