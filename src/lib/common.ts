import { AbiItem } from 'web3/node_modules/web3-utils';

export class Common {
    static Abi2JsonInterface(abi: string): AbiItem[] | AbiItem {
        let abiItem: AbiItem = JSON.parse('{}');

        try {
            let abiArray: AbiItem[] = JSON.parse(abi);
            if (!Array.isArray(abiArray)) return abiItem;
            return abiArray;
        } catch(e) {
            return abiItem;
        }
    }
}