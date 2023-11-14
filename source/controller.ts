import { combineSignals } from "./signal.js";

export function combineControllers(...controllers: Array<AbortController>): AbortController {
    const signals = controllers.map(controller => controller.signal);
    const signal = combineSignals(...signals);
    return {
        get signal(): AbortSignal {
            return signal;
        },
        abort: (reason?: any): void => {
            for (const controller of controllers) {
                controller.abort(reason);
            }
        }
    }
}
