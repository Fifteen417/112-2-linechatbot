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

export type UserProfileResponse = {
  /**
   * User\'s display name
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-profile">displayName Documentation</a>
   */
  displayName: string /**/;
  /**
   * User ID
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-profile">userId Documentation</a>
   */
  userId: string /**/;
  /**
   * Profile image URL. `https` image URL. Not included in the response if the user doesn\'t have a profile image.
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-profile">pictureUrl Documentation</a>
   */
  pictureUrl?: string /**/;
  /**
   * User\'s status message. Not included in the response if the user doesn\'t have a status message.
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-profile">statusMessage Documentation</a>
   */
  statusMessage?: string /**/;
  /**
   * User\'s language, as a BCP 47 language tag. Not included in the response if the user hasn\'t yet consented to the LINE Privacy Policy.
   *
   * @see <a href="https://developers.line.biz/en/reference/messaging-api/#get-profile">language Documentation</a>
   */
  language?: string /**/;
};
