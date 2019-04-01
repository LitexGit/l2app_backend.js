import { L2 } from "./sdk/sdk";

import {
  appPaymentNetwork,
  appRpcUrl,
  cpPrivateKey,
  ethPaymentNetwork,
  ethRpcUrl,
  sessionPayNetwork
  // ethProvider
} from "./conf/config.dev";

import { Request, Response } from "express";

import { Common } from "./lib/common";

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at:", p, "reason:", reason);
  // application specific logging, throwing an error, or other logic here
});

let l2 = L2.GetInstance();
l2.Init(
  cpPrivateKey,
  ethRpcUrl,
  ethPaymentNetwork,
  appRpcUrl,
  appPaymentNetwork,
  sessionPayNetwork
);

l2.on("Transfer", (err: any, res: any) => {
  console.log("SDK Receive Asset", res);
  let { from, to, token, amount, totalTransferredAmount } = res;
  // send back to user

  //   l2.Transfer(from, amount, token);
});

l2.on("UserDeposit", (err: any, res: any) => {
  console.log("SDK Receive UserDeposit", res);
});

l2.on("UserWithdraw", (err: any, res: any) => {
  console.log("SDK Receive UserWithdraw", res);
});

l2.on("ProviderWithdraw", (err: any, res: any) => {
  console.log("SDK Receive ProviderWithdraw", res);
});

l2.on("UserForceWithdraw", (err: any, res: any) => {
  console.log("SDK Receive UserForceWithdraw", res);
});

l2.on("Message", async (err: any, res: any) => {
  console.log("SDK Receive Message", res);
  let { sessionID, from: user, type, content, token, amount } = res;
  let players = await l2.GetPlayersBySessionID(sessionID);

  console.log("session players", players);

  //   let session = await l2.GetSession(sessionID);

  //   await l2.SendMessage(sessionID, user, Number(type)+ 1, content, amount, token);
});

const port: number = 9527;

let express = require("express");
let app = express();

app.use(function(req: Request, res: Response, next: any) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Content-Type", "application/json;charset=utf-8");

  next();
});

app.get("/getSessionID", function(req: Request, res: Response) {
  let user = req.query.user;
  let game = "0x605a409Dc63cFd7e35ef7cb2d2cab8B66b136928";
  let customData = "hello world";
  let sessionID = Common.GenerateSessionID(game);
  console.log("getSessionID user is ", user);

  l2.StartSession(sessionID, game, [user], customData);

  res.json({
    status: 1,
    data: { sessionID: sessionID }
  });
});

app.get("/closeSession", async function(req: Request, res: Response) {
  let sessionID = req.query.sessionID;

  await l2.CloseSession(sessionID);

  res.json({
    status: 1,
    data: { msg: "ok" }
  });
});

app.get("/getTransactions", async function(req: Request, res: Response) {
  let sessionID = req.query.sessionID;

  // await l2.CloseSession(sessionID);

  res.json({
    status: 1,
    data: { msg: "ok" }
  });
});

app.get("/providerWithdraw", async function(req: Request, res: Response) {
  let sessionID = req.query.sessionID;

  // await l2.CloseSession(sessionID);

  res.json({
    status: 1,
    data: { msg: "ok" }
  });
});

app.get("/rebalance", async function(req: Request, res: Response) {
  let sessionID = req.query.sessionID;

  // await l2.CloseSession(sessionID);

  res.json({
    status: 1,
    data: { msg: "ok" }
  });
});

app.get("/forceClose", async function(req: Request, res: Response) {
  let sessionID = req.query.sessionID;

  // await l2.CloseSession(sessionID);

  res.json({
    status: 1,
    data: { msg: "ok" }
  });
});

app.listen(port, function() {
  console.log(`Server running at :${port}`);
});
