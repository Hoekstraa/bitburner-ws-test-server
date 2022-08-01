import { WebSocketServer } from 'ws';

function genMessage(obj, ws) {
    const message = {
        jsonrpc: "2.0",
        method: obj.method,
        result: obj.result,
        params: obj.params,
        error: obj.error,
        id: obj.id,
    };
    return JSON.stringify(message);
}

const wss = new WebSocketServer({ port: 12525 });

wss.on('connection', function connection(ws) {
    ws.on('message', function message(rawMsg) {
        const msg = JSON.parse(rawMsg);
        console.log("Socket message received", msg);

        if(!(msg.method || msg.error || msg.result)) console.log("Empty!");
        else if(msg.error) console.log("Error!");
        else switch(msg.id) {
            case 0: 
                ws.send(genMessage({id: 1, method: "pushFile", params: {server: "home", filename: "testFile1234.txt", content: "Hi!"}}));
                break;
            case 1:
                ws.send(genMessage({id: 2, method: "getFile", params: {server: "home", filename: "testFile1234.txt"}}));
                break;
            case 2:
                ws.send(genMessage({id: 3, method: "getFileNames", params: {server: "home"}}));
                break;
            case 3:
                ws.send(genMessage({id: 4, method: "getAllFiles", params: {server: "home"}}));
                break;
            case 4:
                ws.send(genMessage({id: 5, method: "pushFile", params: {server: "home", filename: "testScript1234.script", content: "while (true) hack(\"n00dles\")"}}));
                break;
            case 5:
                ws.send(genMessage({id: 6, method: "calculateRam", params: {server: "home", filename: "testScript1234.script"}}));
                break;
        }
    });

    // Start first interaction.
    ws.send(genMessage({id: 0, method: "getDefinitionFile"}));
});

console.log(`Server is ready, running on 12525!`)

process.on('SIGINT', function () {
    console.log("Shutting down!");

    process.exit();
});

debugger;