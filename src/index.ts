import { L2 } from './sdk/sdk';

import {
    appPaymentNetwork,
    appRpcUrl,
    cpPrivateKey,
    ethPaymentNetwork,
    ethProvider
} from "./conf/config.dev";

import { Request, Response } from 'express';

import {Common} from "./lib/common";

let l2 = L2.GetInstance();
l2.Init(cpPrivateKey, ethProvider, ethPaymentNetwork, appRpcUrl, appPaymentNetwork);

const port: number = 9527;

let express = require('express');
let app = express();

app.use(function (req: Request, res: Response, next: any) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials','true');
    res.header('Content-Type', 'application/json;charset=utf-8');

    next();
});

app.get('/getSessionId', function (req: Request, res: Response) {
    let game = "0x605a409Dc63cFd7e35ef7cb2d2cab8B66b136928";
    let customData = "hello world";
    let sessionId = Common.GenerateSessionID(game);

    l2.StartSession(sessionId, game, customData);

    res.json({
        status: 1,
        data: { sessionId: sessionId }
    });

});

app.get('/closeSession', async function (req: Request, res: Response) {
    let sessionId = req.query.sessionId;

    await l2.CloseSession(sessionId);

    res.json({
        status: 1,
        data: { msg: 'ok' }
    });
});

app.listen(port, function () {
    console.log(`Server running at :${port}`);
});
