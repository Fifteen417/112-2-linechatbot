/**
 * LINE Messaging API
 * This document describes LINE Messaging API.
 *
 * The version of the OpenAPI document: 0.0.1
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { AgeDemographicFilter } from "./models.js";
import { AppTypeDemographicFilter } from "./models.js";
import { AreaDemographicFilter } from "./models.js";
import { GenderDemographicFilter } from "./models.js";
import { OperatorDemographicFilter } from "./models.js";
import { SubscriptionPeriodDemographicFilter } from "./models.js";

export type DemographicFilter =
  | AgeDemographicFilter // age
  | AppTypeDemographicFilter // appType
  | AreaDemographicFilter // area
  | GenderDemographicFilter // gender
  | OperatorDemographicFilter // operator
  | SubscriptionPeriodDemographicFilter; // subscriptionPeriod

/**
 * Demographic filter
 */
export type DemographicFilterBase = {
  /**
   * Type of demographic filter
   */
  type?: string /**/;
};