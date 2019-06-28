"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethereumjs_util_1 = require("ethereumjs-util");
const contract_1 = require("../conf/contract");
const server_1 = require("./server");
const abi = require("ethereumjs-abi");
const types = contract_1.TYPED_DATA.types;
function dependencies(primaryType, found = []) {
    if (found.includes(primaryType)) {
        return found;
    }
    if (types[primaryType] === undefined) {
        return found;
    }
    found.push(primaryType);
    for (let field of types[primaryType]) {
        for (let dep of dependencies(field.type, found)) {
            if (!found.includes(dep)) {
                found.push(dep);
            }
        }
    }
    return found;
}
function encodeType(primaryType) {
    let deps = dependencies(primaryType);
    deps = deps.filter((t) => t != primaryType);
    deps = [primaryType].concat(deps.sort());
    let result = "";
    for (let type of deps) {
        result += `${type}(${types[type].map(({ name, type }) => `${type} ${name}`).join(",")})`;
    }
    return result;
}
function typeHash(primaryType) {
    return ethereumjs_util_1.keccak256(encodeType(primaryType));
}
function encodeData(primaryType, data) {
    let encTypes = [];
    let encValues = [];
    encTypes.push("bytes32");
    encValues.push(typeHash(primaryType));
    for (let field of types[primaryType]) {
        let value = data[field.name];
        if (field.type == "string" || field.type == "bytes") {
            encTypes.push("bytes32");
            value = ethereumjs_util_1.keccak256(value);
            encValues.push(value);
        }
        else if (types[field.type] !== undefined) {
            encTypes.push("bytes32");
            value = ethereumjs_util_1.keccak256(encodeData(field.type, value));
            encValues.push(value);
        }
        else if (field.type.lastIndexOf("]") === field.type.length - 1) {
            throw "TODO: Arrays currently unimplemented in encodeData";
        }
        else {
            encTypes.push(field.type);
            encValues.push(value);
        }
    }
    return abi.rawEncode(encTypes, encValues);
}
function structHash(primaryType, data) {
    return ethereumjs_util_1.keccak256(encodeData(primaryType, data));
}
function signHash(message) {
    contract_1.TYPED_DATA.domain.verifyingContract = server_1.ethPN.options.address;
    contract_1.TYPED_DATA.domain.chainId = server_1.ethChainId;
    return ethereumjs_util_1.keccak256(Buffer.concat([Buffer.from("1901", "hex"), structHash("EIP712Domain", contract_1.TYPED_DATA.domain), structHash(contract_1.TYPED_DATA.primaryType, message)])).toString("hex");
}
exports.signHash = signHash;
//# sourceMappingURL=sign.js.map