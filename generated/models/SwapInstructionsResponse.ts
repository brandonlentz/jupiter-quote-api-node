/* tslint:disable */
/* eslint-disable */
/**
 * Jupiter API v6
 * The core of [jup.ag](https://jup.ag). Easily get a quote and swap through Jupiter API.  ### Rate Limit The rate limit is 50 requests / 10 seconds. If you need a higher rate limit, feel free to contact us on [#developer-support](https://discord.com/channels/897540204506775583/910250162402779146) on Discord.  ### API Wrapper - Typescript [@jup-ag/api](https://github.com/jup-ag/jupiter-quote-api-node) 
 *
 * The version of the OpenAPI document: 6.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { InstructionObject } from './InstructionObject';
import {
    InstructionObjectFromJSON,
    InstructionObjectFromJSONTyped,
    InstructionObjectToJSON,
} from './InstructionObject';

/**
 * 
 * @export
 * @interface SwapInstructionsResponse
 */
export interface SwapInstructionsResponse {
    /**
     * 
     * @type {InstructionObject}
     * @memberof SwapInstructionsResponse
     */
    tokenLedgerInstruction?: InstructionObject;
    /**
     * The necessary instructions to setup the compute budget.
     * @type {Array<InstructionObject>}
     * @memberof SwapInstructionsResponse
     */
    computeBudgetInstructions?: Array<InstructionObject>;
    /**
     * Setup missing ATA for the users.
     * @type {Array<InstructionObject>}
     * @memberof SwapInstructionsResponse
     */
    setupInstructions?: Array<InstructionObject>;
    /**
     * 
     * @type {InstructionObject}
     * @memberof SwapInstructionsResponse
     */
    swapInstruction?: InstructionObject;
    /**
     * 
     * @type {InstructionObject}
     * @memberof SwapInstructionsResponse
     */
    cleanupInstruction?: InstructionObject;
    /**
     * The lookup table addresses that you can use if you are using versioned transaction.
     * @type {Array<string>}
     * @memberof SwapInstructionsResponse
     */
    addressLookupTableAddresses?: Array<string>;
}

/**
 * Check if a given object implements the SwapInstructionsResponse interface.
 */
export function instanceOfSwapInstructionsResponse(value: object): boolean {
    let isInstance = true;

    return isInstance;
}

export function SwapInstructionsResponseFromJSON(json: any): SwapInstructionsResponse {
    return SwapInstructionsResponseFromJSONTyped(json, false);
}

export function SwapInstructionsResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): SwapInstructionsResponse {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'tokenLedgerInstruction': !exists(json, 'tokenLedgerInstruction') ? undefined : InstructionObjectFromJSON(json['tokenLedgerInstruction']),
        'computeBudgetInstructions': !exists(json, 'computeBudgetInstructions') ? undefined : ((json['computeBudgetInstructions'] as Array<any>).map(InstructionObjectFromJSON)),
        'setupInstructions': !exists(json, 'setupInstructions') ? undefined : ((json['setupInstructions'] as Array<any>).map(InstructionObjectFromJSON)),
        'swapInstruction': !exists(json, 'swapInstruction') ? undefined : InstructionObjectFromJSON(json['swapInstruction']),
        'cleanupInstruction': !exists(json, 'cleanupInstruction') ? undefined : InstructionObjectFromJSON(json['cleanupInstruction']),
        'addressLookupTableAddresses': !exists(json, 'addressLookupTableAddresses') ? undefined : json['addressLookupTableAddresses'],
    };
}

export function SwapInstructionsResponseToJSON(value?: SwapInstructionsResponse | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'tokenLedgerInstruction': InstructionObjectToJSON(value.tokenLedgerInstruction),
        'computeBudgetInstructions': value.computeBudgetInstructions === undefined ? undefined : ((value.computeBudgetInstructions as Array<any>).map(InstructionObjectToJSON)),
        'setupInstructions': value.setupInstructions === undefined ? undefined : ((value.setupInstructions as Array<any>).map(InstructionObjectToJSON)),
        'swapInstruction': InstructionObjectToJSON(value.swapInstruction),
        'cleanupInstruction': InstructionObjectToJSON(value.cleanupInstruction),
        'addressLookupTableAddresses': value.addressLookupTableAddresses,
    };
}

