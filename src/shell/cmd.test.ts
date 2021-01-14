import { CmdShell, ICommandHandler } from "./cmd";

describe("CmdShell", () => {
    it("simple command", () => {

        var handler = {
            test1() { },
            test2() { }
        };

        spyOn(handler, "test1");
        spyOn(handler, "test2");

        var sut = new CmdShell();
        sut.command("test1", handler.test1);

        sut.execute("test1");

        expect(handler.test1).toHaveBeenCalled();
        expect(handler.test2).not.toHaveBeenCalled();
    });

    it("unknown command", () => {   
        var sut = new CmdShell();
        sut.execute("test1");
    });

    it("object handler", () => {   

        var handler = {
            canHandle: function(input: string) : boolean { return input === "test2"; },
            handle: function (input: string)  { }
        };

        spyOn(handler, "handle");

        var sut = new CmdShell();
        sut.command(handler);

        sut.execute("test1");

        expect(handler.handle).not.toHaveBeenCalled();

        sut.execute("test2");

        expect(handler.handle).toHaveBeenCalled();
    });
})