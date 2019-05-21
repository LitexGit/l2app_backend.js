import { keccak256 } from "ethereumjs-util";
import { TYPED_DATA } from "../conf/contract";
import { ethPN, ethChainId } from "./server";
const abi = require("ethereumjs-abi");

const types = TYPED_DATA.types;

function dependencies(primaryType: any, found: any = []) {
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

function encodeType(primaryType: any) {
  // Get dependencies primary first, then alphabetical
  let deps = dependencies(primaryType);
  deps = deps.filter((t: any) => t != primaryType);
  deps = [primaryType].concat(deps.sort());

  // Format as a string with fields
  let result = "";
  for (let type of deps) {
    // @ts-ignore
    result += `${type}(${types[type]
      .map(({ name, type }) => `${type} ${name}`)
      .join(",")})`;
  }

  return result;
}

function typeHash(primaryType: any) {
  return keccak256(encodeType(primaryType));
}

function encodeData(primaryType: any, data: any) {
  let encTypes: any = [];
  let encValues: any = [];

  // Add typehash
  encTypes.push("bytes32");
  encValues.push(typeHash(primaryType));

  // Add field contents
  for (let field of types[primaryType]) {
    let value = data[field.name];
    if (field.type == "string" || field.type == "bytes") {
      encTypes.push("bytes32");
      value = keccak256(value);
      encValues.push(value);
    } else if (types[field.type] !== undefined) {
      encTypes.push("bytes32");
      value = keccak256(encodeData(field.type, value));
      encValues.push(value);
    } else if (field.type.lastIndexOf("]") === field.type.length - 1) {
      throw "TODO: Arrays currently unimplemented in encodeData";
    } else {
      encTypes.push(field.type);
      encValues.push(value);
    }
  }

  return abi.rawEncode(encTypes, encValues);
}

function structHash(primaryType: any, data: any) {
  return keccak256(encodeData(primaryType, data));
}

export function signHash(message: any) {
  TYPED_DATA.domain.verifyingContract = ethPN.options.address;
  TYPED_DATA.domain.chainId = ethChainId;
  return keccak256(
    Buffer.concat([
      Buffer.from("1901", "hex"),
      structHash("EIP712Domain", TYPED_DATA.domain),
      structHash(TYPED_DATA.primaryType, message)
    ])
  ).toString("hex");
}
