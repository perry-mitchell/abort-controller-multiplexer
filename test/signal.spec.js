import { expect } from "chai";
import sinon from "sinon";
import { combineSignals } from "../dist/signal.js";

describe("combineSignals", function() {
    it("returns a single 'signal' instance", function() {
        const ac1 = new AbortController();
        const ac2 = new AbortController();
        const signal = combineSignals(ac1.signal, ac2.signal);
        expect(signal).to.have.property("throwIfAborted").that.is.a("function");
    });

    describe("aborted", function() {
        it("does not show as aborted if no signals aborted", function() {
            const ac1 = new AbortController();
            const ac2 = new AbortController();
            const signal = combineSignals(ac1.signal, ac2.signal);
            expect(signal.aborted).to.equal(false);
        });

        it("shows as aborted if a single signal is aborted", function() {
            const ac1 = new AbortController();
            const ac2 = new AbortController();
            const signal = combineSignals(ac1.signal, ac2.signal);
            ac1.abort();
            expect(signal.aborted).to.equal(true);
        });
    });

    describe("onabort", function() {
        it("is called when a controller is aborted", function() {
            const abortSpy = sinon.spy();
            const ac1 = new AbortController();
            const ac2 = new AbortController();
            const signal = combineSignals(ac1.signal, ac2.signal);
            signal.onabort = abortSpy;
            ac2.abort();
            expect(abortSpy.callCount).to.equal(1, "onabort should have been called once");
            expect(signal.onabort).to.equal(abortSpy, "onabort should be set to the same callback");
        });
    });

    describe("reason", function() {
        it("provides the first abort reason", function() {
            const ac1 = new AbortController();
            const ac2 = new AbortController();
            const signal = combineSignals(ac1.signal, ac2.signal);
            ac2.abort("Aborted");
            expect(signal.reason).to.equal("Aborted", "Signal's abort reason should match that of first aborted controller");
        });
    });

    describe("throwIfAborted", function() {
        it("does not throw if not aborted", function() {
            const ac1 = new AbortController();
            const ac2 = new AbortController();
            const signal = combineSignals(ac1.signal, ac2.signal);
            expect(() => signal.throwIfAborted()).to.not.throw();
        });

        it("throws when aborted", function() {
            const ac1 = new AbortController();
            const ac2 = new AbortController();
            const signal = combineSignals(ac1.signal, ac2.signal);
            ac1.abort();
            expect(() => signal.throwIfAborted()).to.throw(/operation was aborted/);
        });
    });

    describe("EventTarget#addEventListener", function() {
        it("has its listeners called on abort executions", async function() {
            const eventSpy = sinon.spy();
            const ac1 = new AbortController();
            const ac2 = new AbortController();
            const signal = combineSignals(ac1.signal, ac2.signal);
            signal.addEventListener("abort", eventSpy);
            ac1.abort("Test");
            expect(eventSpy.callCount).to.equal(1, "Event callback should have been called once");
            expect(eventSpy.firstCall.args[0]).to.deep.include({
                type: "abort"
            });
        });
    });
});
