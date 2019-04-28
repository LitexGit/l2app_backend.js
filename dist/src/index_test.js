"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("./sdk/sdk");
const config_dev_1 = require("./conf/config.dev");
const common_1 = require("./lib/common");
process.on("unhandledRejection", (reason, p) => {
    console.log("Unhandled Rejection at:", p, "reason:", reason);
});
let l2 = sdk_1.L2.GetInstance();
l2.setDebug(true);
l2.init(config_dev_1.cpPrivateKey, config_dev_1.ethRpcUrl, config_dev_1.ethPaymentNetwork, config_dev_1.appRpcUrl, config_dev_1.appPaymentNetwork, config_dev_1.sessionPayNetwork);
l2.on("Transfer", (err, res) => {
    console.log("SDK Receive Asset", res);
    let { from, to, token, amount, totalTransferredAmount } = res;
});
l2.on("UserDeposit", (err, res) => {
    console.log("SDK Receive UserDeposit", res);
});
l2.on("UserWithdraw", (err, res) => {
    console.log("SDK Receive UserWithdraw", res);
});
l2.on("ProviderWithdraw", (err, res) => {
    console.log("SDK Receive ProviderWithdraw", res);
});
l2.on("UserForceWithdraw", (err, res) => {
    console.log("SDK Receive UserForceWithdraw", res);
});
l2.on("Message", async (err, res) => {
    console.log("SDK Receive Message", res);
    let { sessionID, from: user, type, content, token, amount } = res;
    let players = await l2.getPlayersBySessionID(sessionID);
    console.log("session players", players);
    await l2.sendMessage(sessionID, user, Number(type) + 1, content, amount, token);
});
const port = 9527;
let express = require("express");
let app = express();
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Methods", "GET");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
app.get("/getSessionID", function (req, res) {
    let user = req.query.user;
    let game = "0x605a409Dc63cFd7e35ef7cb2d2cab8B66b136928";
    let customData = "hello world";
    let sessionID = common_1.Common.GenerateSessionID(game);
    console.log("getSessionID user is ", user);
    l2.startSession(sessionID, game, [user], customData);
    res.json({
        status: 1,
        data: { sessionID: sessionID }
    });
});
app.get("/closeSession", async function (req, res) {
    let sessionID = req.query.sessionID;
    await l2.closeSession(sessionID);
    res.json({
        status: 1,
        data: { msg: "ok" }
    });
});
app.get("/getTransactions", async function (req, res) {
    let sessionID = req.query.sessionID;
    res.json({
        status: 1,
        data: { msg: "ok" }
    });
});
app.get("/providerWithdraw", async function (req, res) {
    let sessionID = req.query.sessionID;
    res.json({
        status: 1,
        data: { msg: "ok" }
    });
});
app.get("/rebalance", async function (req, res) {
    let sessionID = req.query.sessionID;
    res.json({
        status: 1,
        data: { msg: "ok" }
    });
});
app.get("/forceClose", async function (req, res) {
    let sessionID = req.query.sessionID;
    res.json({
        status: 1,
        data: { msg: "ok" }
    });
});
app.listen(port, function () {
    console.log(`Server running at :${port}`);
});
//# sourceMappingURL=index_test.js.map