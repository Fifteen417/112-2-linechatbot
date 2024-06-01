/**
 * Webhook Type Definition
 * Webhook event definition of the LINE Messaging API
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { DeliveryContext } from "./deliveryContext.js";
import { Event } from "./event.js";
import { EventMode } from "./eventMode.js";
import { FollowDetail } from "./followDetail.js";
import { Source } from "./source.js";

/**
 * Event object for when your LINE Official Account is added as a friend (or unblocked). You can reply to follow events.
 */
import { EventBase } from "./models.js";

export type FollowEvent = EventBase & {
  type: "follow";
  /**
   * Reply token used to send reply message to this event
   */
  replyToken: string /**/;
  /**
   */
  follow: FollowDetail /**/;
};

export namespace FollowEvent {}