export type OnAbort = null | ((this: AbortSignal, event: Event) => any);

export function combineSignals(...signals: Array<AbortSignal>): AbortSignal {
    const et = new EventTarget();
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
            callback: EventListenerOrEventListenerObject | null,
            options?: AddEventListenerOptions | boolean
        ): void => {
            et.addEventListener(type, callback, options);
        },
        dispatchEvent: (event: Event): boolean => {
            return et.dispatchEvent(event);
        },
        removeEventListener: (type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void => {
            et.removeEventListener(type, callback, options);
        },
        throwIfAborted: (): void => {
            for (const signal of signals) {
                signal.throwIfAborted();
            }
        }
    };
}
