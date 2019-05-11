"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const session_events_1 = require("../listener/session_events");
const Web3 = require("web3");
const web3_eth_contract_1 = require("web3/node_modules/web3-eth-contract");
const cita_sdk_1 = require("@cryptape/cita-sdk");
const contract_1 = require("../conf/contract");
const listener_1 = require("../listener/listener");
const eth_events_1 = require("../listener/eth_events");
const cita_events_1 = require("../listener/cita_events");
const common_1 = require("./common");
const sign_1 = require("./sign");
const session_1 = require("./session");
const mylog_1 = require("./mylog");
const rlp = require("rlp");
const AsyncLock = require("async-lock");
class SDK {
    constructor() {
        exports.debug = true;
        mylog_1.setLogger();
        this.channelTransferLock = new AsyncLock();
    }
    static GetInstance() {
        if (this.instance === undefined) {
            this.instance = new SDK();
        }
        return this.instance;
    }
    async init(cpPrivateKey, ethRpcUrl, ethPaymentNetwork, appRpcUrl, appPaymentNetwork, sessionPayNetwork) {
        mylog_1.logger.debug("L2 server sdk init start with params: ethRpcUrl: [%s], ethPaymentNetwork: [%o], appRpcUrl: [%s], appPaymentNetwork: [%o]", ethRpcUrl, ethPaymentNetwork.address, appRpcUrl, appPaymentNetwork.address);
        exports.web3 = new Web3(Web3.givenProvider || ethRpcUrl);
        this.appRpcUrl = appRpcUrl;
        this.ethRpcUrl = ethRpcUrl;
        exports.CITA = cita_sdk_1.default(appRpcUrl);
        exports.ethPN = new web3_eth_contract_1.Contract(exports.web3.currentProvider, common_1.Common.Abi2JsonInterface(ethPaymentNetwork.abi), ethPaymentNetwork.address);
        exports.appPN = new exports.CITA.base.Contract(common_1.Common.Abi2JsonInterface(appPaymentNetwork.abi), appPaymentNetwork.address);
        exports.ethPN.options.address = ethPaymentNetwork.address;
        exports.appPN.options.address = appPaymentNetwork.address;
        contract_1.TYPED_DATA.domain.verifyingContract = ethPaymentNetwork.address;
        exports.ERC20 = new web3_eth_contract_1.Contract(exports.web3.currentProvider, common_1.Common.Abi2JsonInterface(contract_1.ERC20ABI));
        exports.sessionPN = new exports.CITA.base.Contract(common_1.Common.Abi2JsonInterface(sessionPayNetwork.abi), sessionPayNetwork.address);
        exports.cpProvider = exports.CITA.base.accounts.privateKeyToAccount(cpPrivateKey);
        exports.callbacks = new Map();
        if (exports.cpProvider.address) {
            this.initListeners();
        }
    }
    setDebug(debugFlag) {
        exports.debug = debugFlag;
        mylog_1.setLogger();
    }
    setLogger(logger) {
        mylog_1.setLogger(logger);
    }
    async deposit(amount, token = contract_1.ADDRESS_ZERO) {
        if (!exports.web3.utils.isAddress(token)) {
            throw new Error(`token [${token}] is not a valid address`);
        }
        mylog_1.logger.debug("start deposit with params: amount: [%s], token: [%s]", amount, token);
        let amountBN = exports.web3.utils.toBN(amount).toString();
        let data = exports.ethPN.methods.providerDeposit(token, amountBN).encodeABI();
        if (token !== contract_1.ADDRESS_ZERO) {
            let erc20Data = exports.ERC20.methods
                .approve(exports.ethPN.options.address, amountBN)
                .encodeABI();
            await common_1.Common.SendEthTransaction(exports.cpProvider.address, token, 0, erc20Data, exports.cpProvider.privateKey);
            return await common_1.Common.SendEthTransaction(exports.cpProvider.address, exports.ethPN.options.address, 0, data, exports.cpProvider.privateKey);
        }
        else {
            return await common_1.Common.SendEthTransaction(exports.cpProvider.address, exports.ethPN.options.address, amountBN, data, exports.cpProvider.privateKey);
        }
    }
    async withdraw(amount, token = contract_1.ADDRESS_ZERO) {
        if (!exports.web3.utils.isAddress(token)) {
            throw new Error(`token [${token}] is not a valid address`);
        }
        mylog_1.logger.debug("start withdraw with params: amount: [%s], token: [%s]", amount, token);
        let amountBN = exports.web3.utils.toBN(amount);
        let [{ providerOnchainBalance, providerBalance }, ethProviderBalance] = await Promise.all([
            exports.appPN.methods.paymentNetworkMap(token).call(),
            exports.ethPN.methods.providerBalance(token).call()
        ]);
        mylog_1.logger.debug("providerOnchainBalance:[%s], providerBalance:[%s], ethProviderBalance:[%s]", providerOnchainBalance, providerBalance, ethProviderBalance);
        let onChainBalanceBN = exports.web3.utils.toBN(providerOnchainBalance);
        let balanceBN = exports.web3.utils.toBN(providerBalance);
        if (amountBN.gt(onChainBalanceBN)) {
            throw new Error(`withdraw amount[${amountBN.toString()}] great than onchain balance[${onChainBalanceBN.toString()}]`);
        }
        let balance = exports.web3.utils
            .toBN(providerOnchainBalance)
            .sub(exports.web3.utils.toBN(amount));
        let lastCommitBlock = await common_1.Common.GetLastCommitBlock();
        return await common_1.Common.SendAppChainTX(exports.appPN.methods.providerProposeWithdraw(token, balance.toString(), lastCommitBlock), exports.cpProvider.address, exports.cpProvider.privateKey, "appPN.methods.providerProposeWithdraw");
    }
    async openChannelForUser(userAddress, token = contract_1.ADDRESS_ZERO) {
        if (!exports.web3.utils.isAddress(token)) {
            throw new Error(`token [${token}] is not a valid address`);
        }
        if (!exports.web3.utils.isAddress(userAddress)) {
            throw new Error(`token [${userAddress}] is not a valid address`);
        }
        mylog_1.logger.debug("start openChannelForUser with params: user: [%s], token: [%s]", userAddress, token);
        let channelID = await exports.ethPN.methods.getChannelID(userAddress, token).call();
        let channel = await exports.ethPN.methods.channels(channelID).call();
        if (Number(channel.status) !== contract_1.CHANNEL_STATUS.CHANNEL_STATUS_INIT) {
            throw new Error("channel exist, can not be open.");
        }
        let data = exports.ethPN.methods
            .openChannel(userAddress, userAddress, contract_1.CHANNEL_SETTLE_WINDOW, token, "0")
            .encodeABI();
        return await common_1.Common.SendEthTransaction(exports.cpProvider.address, exports.ethPN.options.address, "0", data, exports.cpProvider.privateKey);
    }
    async rebalance(userAddress, amount, token = contract_1.ADDRESS_ZERO) {
        if (!exports.web3.utils.isAddress(userAddress)) {
            throw new Error(`userAddress [${userAddress}] is not a valid address`);
        }
        if (!exports.web3.utils.isAddress(token)) {
            throw new Error(`token [${token}] is not a valid address`);
        }
        mylog_1.logger.debug("start reblance with params: userAddress: [%s], amount: [%s], token: [%s]", userAddress, amount, token);
        let channelID = await exports.ethPN.methods.getChannelID(userAddress, token).call();
        let channel = await exports.appPN.methods.channelMap(channelID).call();
        if (Number(channel.status) != contract_1.CHANNEL_STATUS.CHANNEL_STATUS_OPEN) {
            throw new Error("channel status is not open");
        }
        let amountBN = exports.web3.utils.toBN(amount);
        let [{ providerBalance }] = await Promise.all([
            exports.appPN.methods.paymentNetworkMap(token).call()
        ]);
        let providerBalanceBN = exports.web3.utils.toBN(providerBalance);
        let [{ amount: balance, nonce }] = await Promise.all([
            exports.appPN.methods.rebalanceProofMap(channelID).call()
        ]);
        let balanceBN = exports.web3.utils.toBN(balance);
        if (amountBN.sub(balanceBN).gt(providerBalanceBN)) {
            return false;
        }
        let reBalanceAmountBN = balanceBN.add(amountBN).toString();
        nonce = exports.web3.utils
            .toBN(nonce)
            .add(exports.web3.utils.toBN(1))
            .toString();
        let messageHash = exports.web3.utils.soliditySha3({ v: exports.ethPN.options.address, t: "address" }, { v: channelID, t: "bytes32" }, { v: reBalanceAmountBN, t: "uint256" }, { v: nonce, t: "uint256" });
        let signature = common_1.Common.SignatureToHex(messageHash, exports.cpProvider.privateKey);
        let res = await common_1.Common.SendAppChainTX(exports.appPN.methods.proposeRebalance(channelID, reBalanceAmountBN, nonce, signature), exports.cpProvider.address, exports.cpProvider.privateKey, "appPN.methods.proposeRebalance");
        let repeatTime = 0;
        while (repeatTime < 10) {
            let newRebalanceProof = await exports.appPN.methods
                .rebalanceProofMap(channelID)
                .call();
            if (newRebalanceProof.nonce === nonce) {
                mylog_1.logger.info("break loop ", repeatTime);
                break;
            }
            await common_1.Common.Sleep(1000);
            repeatTime++;
        }
        return res;
    }
    async kickUser(userAddress, token = contract_1.ADDRESS_ZERO) {
        if (!exports.web3.utils.isAddress(userAddress)) {
            throw new Error(`userAddress [${userAddress}] is not a valid address`);
        }
        if (!exports.web3.utils.isAddress(token)) {
            throw new Error(`token [${token}] is not a valid address`);
        }
        mylog_1.logger.debug("start kickuser with params: userAddress: [%s], token: [%s]", userAddress, token);
        let channelID = await exports.ethPN.methods.getChannelID(userAddress, token).call();
        let channel = await exports.appPN.methods.channelMap(channelID).call();
        if (Number(channel.status) != contract_1.CHANNEL_STATUS.CHANNEL_STATUS_OPEN) {
            throw new Error("channel status is not open");
        }
        let [{ balance, nonce, additionalHash, partnerSignature }, { amount: inAmount, nonce: inNonce, regulatorSignature, providerSignature }] = await Promise.all([
            exports.appPN.methods.balanceProofMap(channelID, exports.cpProvider.address).call(),
            exports.appPN.methods.rebalanceProofMap(channelID).call()
        ]);
        partnerSignature = partnerSignature || "0x0";
        regulatorSignature = regulatorSignature || "0x0";
        providerSignature = providerSignature || "0x0";
        mylog_1.logger.debug("closeChannel params:  channelID:[%s], balance:[%s], nonce:[%s], additionalHash:[%s], partnerSignature:[%s], inAmount:[%s], inNonce:[%s], regulatorSignature:[%s], inProviderSignature:[%s]", channelID, balance, nonce, additionalHash, partnerSignature, inAmount, inNonce, regulatorSignature, providerSignature);
        let data = await exports.ethPN.methods
            .closeChannel(channelID, balance, nonce, additionalHash, partnerSignature, inAmount, inNonce, regulatorSignature, providerSignature)
            .encodeABI();
        return await common_1.Common.SendEthTransaction(exports.cpProvider.address, exports.ethPN.options.address, 0, data, exports.cpProvider.privateKey);
    }
    async transfer(to, amount, token = contract_1.ADDRESS_ZERO) {
        if (!exports.web3.utils.isAddress(to)) {
            throw new Error(`to [${to}] is not a valid address`);
        }
        if (!exports.web3.utils.isAddress(token)) {
            throw new Error(`token [${token}] is not a valid address`);
        }
        mylog_1.logger.debug("Transfer start execute with params: to: [%s], amount: [%s], token: [%s]", to, amount, token);
        let channelID = await exports.ethPN.methods.getChannelID(to, token).call();
        return this.channelTransferLock.acquire(channelID, async (done) => {
            let result = await this.doTransfer(channelID, to, amount, token);
            done(result);
        });
    }
    async doTransfer(channelID, to, amount, token = contract_1.ADDRESS_ZERO) {
        let { toBN } = exports.web3.utils;
        let amountBN = toBN(amount);
        await this.checkBalance(to, amountBN.toString(), token, true);
        let [{ balance, nonce, additionalHash }] = await Promise.all([
            exports.appPN.methods.balanceProofMap(channelID, to).call()
        ]);
        let balanceBN = toBN(balance);
        let assetAmountBN = amountBN.add(balanceBN).toString();
        nonce = toBN(nonce)
            .add(toBN(1))
            .toString();
        additionalHash = "0x0";
        let messageHash = sign_1.signHash({
            channelID: channelID,
            balance: assetAmountBN,
            nonce: nonce,
            additionalHash: additionalHash
        });
        let signature = common_1.Common.SignatureToHex(messageHash, exports.cpProvider.privateKey);
        return await common_1.Common.SendAppChainTX(exports.appPN.methods.transfer(to, channelID, assetAmountBN, nonce, additionalHash, signature), exports.cpProvider.address, exports.cpProvider.privateKey, "appPN.methods.transfer");
    }
    async startSession(sessionID, game, userList, customData) {
        mylog_1.logger.debug("start session with params: sessionID: [%s], game: [%s], userList: [%o], customData: [%s]", sessionID, game, userList, customData);
        if (await session_1.Session.isExists(sessionID)) {
            throw new Error("session is already exist, can not start again");
        }
        else {
            await session_1.Session.InitSession(sessionID, game, userList, customData);
        }
    }
    async joinSession(sessionID, user) {
        if (!exports.web3.utils.isAddress(user)) {
            throw new Error(`user[${user}] is not valid address`);
        }
        return await session_1.Session.JoinSession(sessionID, user);
    }
    async getSession(sessionID) {
        let count_down = 10;
        let session;
        for (let i = 0; i < count_down; i++) {
            session = await session_1.Session.GetSession(sessionID);
            if (session) {
                break;
            }
            await common_1.Common.Sleep(1000);
        }
        if (!session) {
            throw new Error("session not found");
        }
        return session;
    }
    async sendMessage(sessionID, to, type, content, amount = "0", token = contract_1.ADDRESS_ZERO) {
        mylog_1.logger.debug("start sendmessage with params: sessionID: [%s], to: [%s], type: [%s], content: [%s], amount: [%s], token: [%s]", sessionID, to, type, content, amount, token);
        if (await session_1.Session.isExists(sessionID)) {
            let channelID = "0x0000000000000000000000000000000000000000000000000000000000000000";
            if (Number(amount) > 0) {
                channelID = await exports.ethPN.methods.getChannelID(to, token).call();
                return this.channelTransferLock.acquire(channelID, async (done) => {
                    let result = await this.doSendMessage(channelID, sessionID, to, type, content, amount, token);
                    done(result);
                });
            }
            else {
                return await this.doSendMessage(channelID, sessionID, to, type, content, amount, token);
            }
        }
        else {
            throw new Error("Session is not open");
        }
    }
    async doSendMessage(channelID, sessionID, to, type, content, amount = "0", token = contract_1.ADDRESS_ZERO) {
        let from = exports.cpProvider.address;
        let messageHash = exports.web3.utils.soliditySha3({ t: "address", v: from }, { t: "address", v: to }, { t: "bytes32", v: sessionID }, { t: "uint8", v: type }, { t: "bytes", v: content });
        let signature = common_1.Common.SignatureToHex(messageHash, exports.cpProvider.privateKey);
        let transferData = await this.buildTransferData(channelID, to, amount, token, messageHash);
        return session_1.Session.SendSessionMessage(exports.cpProvider.address, to, {
            sessionID,
            mType: type,
            content,
            signature
        }, transferData);
    }
    async closeSession(sessionID) {
        mylog_1.logger.debug("start CloseSession, params: sessionID: [%s]", sessionID);
        if (await session_1.Session.isExists(sessionID)) {
            return await session_1.Session.CloseSession(sessionID);
        }
        else {
            throw new Error("session is not exist now");
        }
    }
    on(event, callback) {
        exports.callbacks.set(event, callback);
    }
    async getPaymentNetwork(token = contract_1.ADDRESS_ZERO) {
        let [{ userCount, userTotalDeposit, userTotalWithdraw, providerDeposit, providerWithdraw, providerBalance, providerOnchainBalance }] = await Promise.all([exports.appPN.methods.paymentNetworkMap(token).call()]);
        return {
            userCount: userCount,
            userTotalDeposit: userTotalDeposit,
            userTotalWithdraw: userTotalWithdraw,
            providerDeposit: providerDeposit,
            providerWithdraw: providerWithdraw,
            providerBalance: providerBalance,
            providerOnChainBalance: providerOnchainBalance
        };
    }
    async getTokeFeeRate(token = contract_1.ADDRESS_ZERO) {
        let feeRate = await exports.appPN.methods.feeRateMap(token).call();
        return Number(feeRate) / 10000;
    }
    async getChannelInfo(userAddress, token = contract_1.ADDRESS_ZERO) {
        let channelID = await exports.ethPN.methods.getChannelID(userAddress, token).call();
        if (!channelID) {
            return {
                channel: { channelID }
            };
        }
        let channel = await exports.appPN.methods.channelMap(channelID).call();
        channel.channelID = channelID;
        return channel;
    }
    async getAllTXs(token = contract_1.ADDRESS_ZERO) {
        let [inTXs, outTXs] = await Promise.all([
            exports.appPN.getPastEvents("Transfer", { filter: { to: exports.cpProvider.address } }),
            exports.appPN.getPastEvents("Transfer", { filter: { from: exports.cpProvider.address } })
        ]);
        const cmpNonce = (key) => {
            return (a, b) => {
                return a[key] - b[key];
            };
        };
        let lastBalance = exports.web3.utils.toBN(0);
        const getTX = (tx) => {
            let { balance, ...rest } = tx.returnValues;
            balance = exports.web3.utils.toBN(balance);
            let amount = balance.sub(lastBalance).toString();
            lastBalance = balance;
            return {
                id: tx.transactionHash,
                amount,
                ...rest
            };
        };
        inTXs = inTXs.sort(cmpNonce("nonce")).map(tx => getTX(tx));
        outTXs = outTXs.sort(cmpNonce("nonce")).map(tx => getTX(tx));
        return { in: inTXs, out: outTXs };
    }
    async getMessagesBySessionID(sessionID) {
        return await exports.sessionPN.methods.exportSession(sessionID).call();
    }
    async getPlayersBySessionID(sessionID) {
        return await exports.sessionPN.methods.exportPlayer(sessionID).call();
    }
    async exportSessionBytes(sessionID) {
        return await exports.sessionPN.methods.exportSessionBytes(sessionID).call();
    }
    async initListeners() {
        try {
            this.ethWatcher && this.ethWatcher.stop();
            let ethWatchList = [{ contract: exports.ethPN, listener: eth_events_1.ETH_EVENTS }];
            this.ethWatcher = new listener_1.default(exports.web3.eth, this.ethRpcUrl, 5000, ethWatchList);
            this.ethWatcher.start();
        }
        catch (err) {
            mylog_1.logger.error("ethWatcher err: ", err);
        }
        try {
            this.appWatcher && this.appWatcher.stop();
            let appWatchList = [
                { contract: exports.appPN, listener: cita_events_1.CITA_EVENTS },
                { contract: exports.sessionPN, listener: session_events_1.SESSION_EVENTS }
            ];
            this.appWatcher = new listener_1.default(exports.CITA.base, this.appRpcUrl, 1000, appWatchList);
            this.appWatcher.start();
        }
        catch (err) {
            mylog_1.logger.error("appWatcher err: ", err);
        }
    }
    async checkBalance(to, amount, token, needRebalance) {
        let { toBN } = exports.web3.utils;
        let channelID = await exports.ethPN.methods.getChannelID(to, token).call();
        let channel = await exports.appPN.methods.channelMap(channelID).call();
        if (Number(channel.status) != contract_1.CHANNEL_STATUS.CHANNEL_STATUS_OPEN) {
            throw new Error("channel status is not open");
        }
        let balanceBN = toBN(channel.providerBalance);
        let amountBN = toBN(amount);
        if (balanceBN.gte(amountBN)) {
            return;
        }
        if (!needRebalance) {
            throw new Error(`providerBalance[${channel.providerBalance}] is less than sendAmount[${amount}]`);
        }
        await this.rebalance(to, amountBN.sub(balanceBN).toString(), token);
        return true;
    }
    async buildTransferData(channelID, user, amount, token, messageHash) {
        let { hexToBytes, toHex, soliditySha3, toBN } = exports.web3.utils;
        let balance = "0";
        let nonce = "0";
        let additionalHash = "0x0000000000000000000000000000000000000000000000000000000000000000";
        let paymentSignature = "0x0";
        if (Number(amount) > 0) {
            channelID = await exports.ethPN.methods.getChannelID(user, token).call();
            await this.checkBalance(user, amount, token, true);
            let balanceProof = await exports.appPN.methods
                .balanceProofMap(channelID, user)
                .call();
            balance = toBN(amount)
                .add(toBN(balanceProof.balance))
                .toString();
            nonce = toBN(balanceProof.nonce)
                .add(toBN(1))
                .toString();
            additionalHash = soliditySha3({ t: "bytes32", v: messageHash }, { t: "uint256", v: amount });
            let messageHash2 = sign_1.signHash({
                channelID: channelID,
                balance: balance,
                nonce: nonce,
                additionalHash: additionalHash
            });
            paymentSignature = common_1.Common.SignatureToHex(messageHash2, exports.cpProvider.privateKey);
        }
        let paymentData = [
            channelID,
            toHex(balance),
            toHex(nonce),
            toHex(amount),
            additionalHash,
            paymentSignature
        ];
        console.log("paymentData: ", paymentData);
        let rlpencode = "0x" + rlp.encode(paymentData).toString("hex");
        console.log("rlpencode is", rlpencode);
        return rlpencode;
    }
}
exports.SDK = SDK;
//# sourceMappingURL=server.js.map