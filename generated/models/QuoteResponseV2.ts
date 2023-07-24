/* tslint:disable */
/* eslint-disable */
/**
 * Jupiter Api v5
 * Jupiter quote and swap API
 *
 * The version of the OpenAPI document: 5.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
import type { PlatformFee } from './PlatformFee';
import {
    PlatformFeeFromJSON,
    PlatformFeeFromJSONTyped,
    PlatformFeeToJSON,
} from './PlatformFee';
import type { RoutePlanStep } from './RoutePlanStep';
import {
    RoutePlanStepFromJSON,
    RoutePlanStepFromJSONTyped,
    RoutePlanStepToJSON,
} from './RoutePlanStep';
import type { SwapMode } from './SwapMode';
import {
    SwapModeFromJSON,
    SwapModeFromJSONTyped,
    SwapModeToJSON,
} from './SwapMode';

/**
 * 
 * @export
 * @interface QuoteResponseV2
 */
export interface QuoteResponseV2 {
    /**
     * 
     * @type {string}
     * @memberof QuoteResponseV2
     */
    inputMint: string;
    /**
     * 
     * @type {string}
     * @memberof QuoteResponseV2
     */
    inAmount?: string;
    /**
     * 
     * @type {string}
     * @memberof QuoteResponseV2
     */
    outputMint: string;
    /**
     * 
     * @type {string}
     * @memberof QuoteResponseV2
     */
    outAmount: string;
    /**
     * 
     * @type {string}
     * @memberof QuoteResponseV2
     */
    otherAmountThreshold: string;
    /**
     * 
     * @type {SwapMode}
     * @memberof QuoteResponseV2
     */
    swapMode: SwapMode;
    /**
     * 
     * @type {number}
     * @memberof QuoteResponseV2
     */
    slippageBps: number;
    /**
     * 
     * @type {PlatformFee}
     * @memberof QuoteResponseV2
     */
    platformFee?: PlatformFee;
    /**
     * 
     * @type {number}
     * @memberof QuoteResponseV2
     */
    priceImpactPct: number;
    /**
     * 
     * @type {Array<RoutePlanStep>}
     * @memberof QuoteResponseV2
     */
    routePlan: Array<RoutePlanStep>;
    /**
     * 
     * @type {number}
     * @memberof QuoteResponseV2
     */
    contextSlot?: number;
    /**
     * 
     * @type {number}
     * @memberof QuoteResponseV2
     */
    timeTaken?: number;
}

/**
 * Check if a given object implements the QuoteResponseV2 interface.
 */
export function instanceOfQuoteResponseV2(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "inputMint" in value;
    isInstance = isInstance && "outputMint" in value;
    isInstance = isInstance && "outAmount" in value;
    isInstance = isInstance && "otherAmountThreshold" in value;
    isInstance = isInstance && "swapMode" in value;
    isInstance = isInstance && "slippageBps" in value;
    isInstance = isInstance && "priceImpactPct" in value;
    isInstance = isInstance && "routePlan" in value;

    return isInstance;
}

export function QuoteResponseV2FromJSON(json: any): QuoteResponseV2 {
    return QuoteResponseV2FromJSONTyped(json, false);
}

export function QuoteResponseV2FromJSONTyped(json: any, ignoreDiscriminator: boolean): QuoteResponseV2 {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'inputMint': json['inputMint'],
        'inAmount': !exists(json, 'inAmount') ? undefined : json['inAmount'],
        'outputMint': json['outputMint'],
        'outAmount': json['outAmount'],
        'otherAmountThreshold': json['otherAmountThreshold'],
        'swapMode': SwapModeFromJSON(json['swapMode']),
        'slippageBps': json['slippageBps'],
        'platformFee': !exists(json, 'platformFee') ? undefined : PlatformFeeFromJSON(json['platformFee']),
        'priceImpactPct': json['priceImpactPct'],
        'routePlan': ((json['routePlan'] as Array<any>).map(RoutePlanStepFromJSON)),
        'contextSlot': !exists(json, 'contextSlot') ? undefined : json['contextSlot'],
        'timeTaken': !exists(json, 'timeTaken') ? undefined : json['timeTaken'],
    };
}

export function QuoteResponseV2ToJSON(value?: QuoteResponseV2 | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'inputMint': value.inputMint,
        'inAmount': value.inAmount,
        'outputMint': value.outputMint,
        'outAmount': value.outAmount,
        'otherAmountThreshold': value.otherAmountThreshold,
        'swapMode': SwapModeToJSON(value.swapMode),
        'slippageBps': value.slippageBps,
        'platformFee': PlatformFeeToJSON(value.platformFee),
        'priceImpactPct': value.priceImpactPct,
        'routePlan': ((value.routePlan as Array<any>).map(RoutePlanStepToJSON)),
        'contextSlot': value.contextSlot,
        'timeTaken': value.timeTaken,
    };
}

