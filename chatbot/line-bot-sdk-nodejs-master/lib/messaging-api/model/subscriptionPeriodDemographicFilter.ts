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

import { DemographicFilter } from "./demographicFilter.js";
import { SubscriptionPeriodDemographic } from "./subscriptionPeriodDemographic.js";

import { DemographicFilterBase } from "./models.js";

export type SubscriptionPeriodDemographicFilter = DemographicFilterBase & {
  type: "subscriptionPeriod";
  /**
   */
  gte?: SubscriptionPeriodDemographic /**/;
  /**
   */
  lt?: SubscriptionPeriodDemographic /**/;
};

export namespace SubscriptionPeriodDemographicFilter {}