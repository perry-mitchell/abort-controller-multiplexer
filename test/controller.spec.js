import { expect } from "chai";
import sinon from "sinon";
import { combineControllers } from "../dist/controller.js";

describe("combineControllers", function () {
    it("returns a single 'controller' instance", function () {
        const ac1 = new AbortController();
        const ac2 = new AbortController();
        const controller = combineControllers(ac1, ac2);
        expect(controller).to.have.property("abort").that.is.a("function");
    });

    describe("abort", function () {
        it("aborts all controllers", function () {
            const ac1 = new AbortController();
            const ac2 = new AbortController();
            sinon.spy(ac1, "abort");
            sinon.spy(ac2, "abort");
            const controller = combineControllers(ac1, ac2);
            controller.abort();
            expect(ac1.abort.callCount).to.equal(
                1,
                "First abort controller's 'abort' method should have been called"
            );
            expect(ac2.abort.callCount).to.equal(
                1,
                "Second abort controller's 'abort' method should have been called"
            );
            expect(ac1.signal.aborted).to.equal(
                true,
                "First abort controller should have been aborted"
            );
            expect(ac2.signal.aborted).to.equal(
                true,
                "Second abort controller should have been aborted"
            );
        });
    });

    describe("signal", function () {
        it("is equal to a 'signal' instance", function () {
            const ac1 = new AbortController();
            const ac2 = new AbortController();
            const controller = combineControllers(ac1, ac2);
            expect(controller.signal).to.have.property("throwIfAborted").that.is.a("function");
        });

        it("doesn't change between invocations", function () {
            const ac1 = new AbortController();
            const ac2 = new AbortController();
            const controller = combineControllers(ac1, ac2);
            expect(controller.signal).to.equal(controller.signal, "Signals should match");
        });
    });
});
