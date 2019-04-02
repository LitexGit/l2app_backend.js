"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ethereumjs_util_1 = require("ethereumjs-util");
var contract_1 = require("../conf/contract");
var abi = require("ethereumjs-abi");
var types = contract_1.TYPED_DATA.types;
function dependencies(primaryType, found) {
    if (found === void 0) { found = []; }
    if (found.includes(primaryType)) {
        return found;
    }
    if (types[primaryType] === undefined) {
        return found;
    }
    found.push(primaryType);
    for (var _i = 0, _a = types[primaryType]; _i < _a.length; _i++) {
        var field = _a[_i];
        for (var _b = 0, _c = dependencies(field.type, found); _b < _c.length; _b++) {
            var dep = _c[_b];
            if (!found.includes(dep)) {
                found.push(dep);
            }
        }
    }
    return found;
}
function encodeType(primaryType) {
    var deps = dependencies(primaryType);
    deps = deps.filter(function (t) { return t != primaryType; });
    deps = [primaryType].concat(deps.sort());
    var result = "";
    for (var _i = 0, deps_1 = deps; _i < deps_1.length; _i++) {
        var type = deps_1[_i];
        result += type + "(" + types[type]
            .map(function (_a) {
            var name = _a.name, type = _a.type;
            return type + " " + name;
        })
            .join(",") + ")";
    }
    return result;
}
function typeHash(primaryType) {
    return ethereumjs_util_1.keccak256(encodeType(primaryType));
}
function encodeData(primaryType, data) {
    var encTypes = [];
    var encValues = [];
    encTypes.push("bytes32");
    encValues.push(typeHash(primaryType));
    for (var _i = 0, _a = types[primaryType]; _i < _a.length; _i++) {
        var field = _a[_i];
        var value = data[field.name];
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
    return ethereumjs_util_1.keccak256(Buffer.concat([
        Buffer.from("1901", "hex"),
        structHash("EIP712Domain", contract_1.TYPED_DATA.domain),
        structHash(contract_1.TYPED_DATA.primaryType, message)
    ])).toString("hex");
}
exports.signHash = signHash;
//# sourceMappingURL=sign.js.map