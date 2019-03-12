import { AbiItem } from 'web3-utils/types';

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