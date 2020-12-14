"use strict";
import { NativeModules } from "react-native";
import DevicePlatform from './DevicePlatform'
import ERROR_MESSAGE from './ErrorMessageKeys'
import Helper from './Helpers/Helper'
import StringHelper from './Helpers/StringHelper'
import ObjectHelper from './ObjectHelper'
import PARAMS from './ParamKeys'
const { MixpanelReactNative } = NativeModules;

if (!MixpanelReactNative) {
    throw new Error(`mixpanel-react-native: MixpanelReactNative is null. To fix this issue try these steps:
    • Run \`react-native link mixpanel-react-native\` in the project root.
    • Rebuild and re-run the app.
    • If you are using CocoaPods on iOS, run \`pod install\` in the \`ios\` directory and then rebuild and re-run the app. You may also need to re-open Xcode to get the new pods.
    If none of these fix the issue, please open an issue on the Github repository: https://github.com/mixpanel/mixpanel-react-native`);
}


/* -------------------- Default opt out flag -------------------- */
const DEFAULT_OPT_OUT = false;

interface OptionsModel {
    distinctId?: string
    properties?: Map<string, string> | {}
} 

export default class Mixpanel {

    /* -------------------- Properties -------------------- */
    token: string
    people: People
    options: OptionsModel

    /* -------------------- Constructor -------------------- */
    constructor(token: string) {
        if (!StringHelper.isValid(token)) {
            StringHelper.raiseError(PARAMS.TOKEN);
        }
        this.token = token;
        this.people = new People(this.token);
    }

    /* -------------------- Actions -------------------- */
    /**
      Initialize mixpanel setup.
     */
    static async init(token: string, optOutTrackingDefault: boolean = DEFAULT_OPT_OUT): Promise<Mixpanel> {
        try {
            let metadata = Helper.getMetaData();
            await MixpanelReactNative.initialize(token, optOutTrackingDefault, metadata);
            return new Mixpanel(token);
        } catch (error) {
            console.warn('Mixpanel error: ' + JSON.stringify(error))
            return Promise.reject(error)
        }       
    }

    /**
      Check whether the current user has opted out tracking or not.
     */
    hasOptedOutTracking(): void {
        return MixpanelReactNative.hasOptedOutTracking(this.token);
    }

    /**
      This method is used to opt in an already opted out user from tracking. People updates and track calls will be
      sent to Mixpanel after using this method.

      options = {
          distinctId: string
          properties: {
          }
      }
     */
    optInTracking(options?: OptionsModel): void {
        options = options || { distinctId: null, properties: {} };

        if (!StringHelper.isValidOrUndefined(options.distinctId)) {
            StringHelper.raiseError(PARAMS.DISTINCT_ID_IN_OPTIONS);
        }

        if (!ObjectHelper.isValidOrUndefined(options.properties)) {
            ObjectHelper.raiseError(PARAMS.PROPERTIES_IN_OPTIONS);
        }
        return MixpanelReactNative.optInTracking(this.token, options.distinctId, options.properties || {});
    }

    /**
      This method is used to opt out from tracking. This causes all events and people request no longer
      to be sent back to the Mixpanel server.
     */
    optOutTracking(): void {
        return MixpanelReactNative.optOutTracking(this.token);
    }

    /**
      Identify a user with a unique ID instead of a Mixpanel
      randomly generated distinctId. If the method is never called,
      then unique visitors will be identified by a UUID generated
      the first time they visit the site.
     */
    identify(distinctId: string): void {
        if (!StringHelper.isValid(distinctId)) {
            StringHelper.raiseError(PARAMS.DISTINCT_ID);
        }
        return MixpanelReactNative.identify(this.token, distinctId);
    }

    /**
      This function creates an alias for distinctId.
     */
    alias(alias: string, distinctId: string): void {
        if (!StringHelper.isValid(alias)) {
            StringHelper.raiseError(PARAMS.ALIAS);
        }

        if (!StringHelper.isValid(distinctId)) {
            StringHelper.raiseError(PARAMS.DISTINCT_ID);
        }

        return MixpanelReactNative.alias(this.token, alias, distinctId);
    }

    /**
      Track an event.
     */
    track(eventName: string, properties?: {} | Map<string, string>): void {
        if (!StringHelper.isValid(eventName)) {
            StringHelper.raiseError(PARAMS.EVENT_NAME);
        }

        if (!ObjectHelper.isValidOrUndefined(properties)) {
            ObjectHelper.raiseError(PARAMS.PROPERTIES);
        }

        return MixpanelReactNative.track(this.token, eventName, properties || {});
    }

    /**
      Register a set of super properties, which are included with all
      events. This will overwrite previous super property values.
     */
    registerSuperProperties(properties?: {} |  Map<string, string>): void {
        if (!ObjectHelper.isValidOrUndefined(properties)) {
            ObjectHelper.raiseError(PARAMS.PROPERTIES);
        }

        return MixpanelReactNative.registerSuperProperties(this.token, properties || {});
    }

    /**
      Register a set of super properties only once. This will not
      overwrite previous super property values, unlike register().
     */
    registerSuperPropertiesOnce(properties:  {} | Map<string, string>): void {
        if (!ObjectHelper.isValidOrUndefined(properties)) {
            ObjectHelper.raiseError(PARAMS.PROPERTIES);
        }

        return MixpanelReactNative.registerSuperPropertiesOnce(this.token, properties || {});
    }

    /**
      Delete a super property stored with the current user.
     */
    unregisterSuperProperty(propertyName: string): void {
        if (!StringHelper.isValid(propertyName)) {
            StringHelper.raiseError(PARAMS.PROPERTY_NAME);
        }

        return MixpanelReactNative.unregisterSuperProperty(this.token, propertyName);
    }

    /**
      Get current user super property.
     */
    getSuperProperties(): void {
        return MixpanelReactNative.getSuperProperties(this.token);
    }

    /**
     Clear all currently set super properties.
     */
    clearSuperProperties(): void {
        return MixpanelReactNative.clearSuperProperties(this.token);
    }

    /**
      Use to calculate time required for an event by including the time between this call and a
      later 'track' call for the same event in the properties sent
      with the event.
     */
    timeEvent(eventName: string): void {
        if (!StringHelper.isValid(eventName)) {
            StringHelper.raiseError(PARAMS.EVENT_NAME);
        }

        return MixpanelReactNative.timeEvent(this.token, eventName);
    }

    /**
     Clears all current event timers.
     */
    clearTimedEvents(): void {
        return MixpanelReactNative.clearTimedEvents(this.token);  
    }

    /**
      Retrieve the time elapsed for the named event since timeEvent(eventName) was called.
     */
    eventElapsedTime(eventName: string): void {
        if (!StringHelper.isValid(eventName)) {
            StringHelper.raiseError(PARAMS.EVENT_NAME);
        }

        return MixpanelReactNative.eventElapsedTime(this.token, eventName);
    }

    /**
      Clear super properties and generates a new random distinctId for this instance.
      Useful for clearing data when a user logs out.
     */
    reset(): void {
        return MixpanelReactNative.reset(this.token);
    }

    /**
      For Android only
      Use to check whether user is identified or not.
     */
    isIdentified(): boolean {
        if (Helper.getDevicePlatform() !== DevicePlatform.Android) {
            throw new Error(ERROR_MESSAGE.ONLY_FOR_ANDROID);
        }
        return MixpanelReactNative.isIdentified(this.token);
    }

    /**
     Returns the string id currently being used to uniquely identify the user associated
     with events.
    */
    getDistinctId(): string {
        return MixpanelReactNative.getDistinctId(this.token);
    }

    /**
      Upload queued data to the Mixpanel server.
     */
    flush(): void {
        return MixpanelReactNative.flush(this.token);
    }
}


export class People {

    /* -------------------- Properties -------------------- */
    token: string


    /* -------------------- Constructor -------------------- */
    constructor(token: string) {
        this.token = token;
    }

    /* -------------------- Actions -------------------- */
    /**
      Set properties on an user record in engage.
     */

    set(prop: {} | Map<string, string> | string, to?: string) {
        let properties = {};

        if (typeof prop == 'object') {
            if (ObjectHelper.isValid(prop)) properties = JSON.parse(JSON.stringify(prop || {}));
        }

        if (typeof prop == 'string') {
            if (!StringHelper.isValid(prop)) StringHelper.raiseError(PARAMS.PROP);
            properties[prop] = to;
        }

        return MixpanelReactNative.set(this.token, properties);
    }

    /**
      The same as people.set but This method allows you to set a user attribute, only if it is not currently set.
     */
    setOnce(prop: {} | Map<string, string> | string, to?: {}) {
        let properties = {};
      
        if (typeof prop == 'object') {
            prop = prop || {};
            properties = JSON.parse(JSON.stringify(prop));
        } 

        if (typeof prop == 'string') {
            if (!StringHelper.isValid(prop)) StringHelper.raiseError(PARAMS.PROP);
            properties[prop] = to;
        }


        return MixpanelReactNative.setOnce(this.token, properties);
    }

    /**
      Track a revenue transaction for the identified people profile.
     */
    trackCharge(charge: number, properties?: {}) {
        if (isNaN(charge)) { // TODO: Check f it works that way
            throw new Error(`${PARAMS.CHARGE}${ERROR_MESSAGE.REQUIRED_DOUBLE}`)
        }

        if (!ObjectHelper.isValidOrUndefined(properties)) {
            ObjectHelper.raiseError(PARAMS.PROPERTIES);
        }
        return MixpanelReactNative.trackCharge(this.token, charge, properties || {});
    }

    /**
      Clear all the current user's transactions.
     */
    clearCharges(): void {
        return MixpanelReactNative.clearCharges(this.token);
    }

    /**
      Increment/Decrement properties on an user record in engage.
     */
    increment(prop: Map<string, number>  | string, by?: number) {
        var add = {};

        if (typeof prop == 'object' && ObjectHelper.isValid(prop)) {
            Object.keys(prop).forEach(function (key) {
                var val = prop[key];
                if (isNaN(parseFloat(val))) {
                    throw new Error(`${PARAMS.PROPERTY_VALUE}${ERROR_MESSAGE.REQUIRED_DOUBLE}`);
                }
                add[key] = val;
            });
        }

        if (typeof prop == 'string') {
            by = by || 1;
            if (by == undefined || isNaN(by)) {
                throw new Error(`${PARAMS.PROPERTY_VALUE}${ERROR_MESSAGE.REQUIRED_DOUBLE}`);
            }

            if (!StringHelper.isValid(prop)) {
                StringHelper.raiseError(PARAMS.NAME);
            }

            add[prop] = by;
        }

        return MixpanelReactNative.increment(this.token, add);
    }

    /**
      Append a value to a list-valued people analytics property.
     */
    append(name: string, value: string | number): void {
        let appendProp = {};
        if (!StringHelper.isValid(name)) {
            StringHelper.raiseError(PARAMS.NAME);
        } else {
            appendProp[name] = value;
        }

        if (DevicePlatform.iOS === Helper.getDevicePlatform()) {
            return MixpanelReactNative.append(this.token, appendProp);
        } else {
            return MixpanelReactNative.append(this.token, name, appendProp);
        }
    }

    /**
      Delete an user record in engage.
     */
    deleteUser(): void {
        return MixpanelReactNative.deleteUser(this.token);
    }

    /**
      Remove list properties.
     */
    remove(name: string, value: any): void {
        let removeProp = {};
        if (!StringHelper.isValid(name)) {
            StringHelper.raiseError(PARAMS.NAME);
        } else {
            removeProp[name] = value;
        }

        if (DevicePlatform.iOS === Helper.getDevicePlatform()) {
            return MixpanelReactNative.remove(this.token, removeProp);
        } else {
            return MixpanelReactNative.remove(this.token, name, removeProp);
        }
    }

    /**
      Add values to a list-valued property only if they are not already present in the list.
     */
    union(name: string, values: string[]): void {
        if (!StringHelper.isValid(name)) {
            StringHelper.raiseError(PARAMS.NAME);
        }

        values = Array.isArray(values) ? values : [values];

        if (DevicePlatform.iOS === Helper.getDevicePlatform()) {
            return MixpanelReactNative.union(this.token, { name: values });
        } 

        return MixpanelReactNative.union(this.token, name, values);
    }

    /**
      Remove a list of properties and their values from the current user's profile
      in Mixpanel People.
     */
    unset(propertyName: string): void {
        if (!StringHelper.isValid(propertyName)) {
            StringHelper.raiseError(PARAMS.PROPERTY_NAME);
        }
        return MixpanelReactNative.unset(this.token, propertyName);
    }

    /**
      Register the given device to receive push notifications.
     */
    setPushRegistrationId(deviceToken: string): void {
        if (!StringHelper.isValid(deviceToken)) {
            StringHelper.raiseError(PARAMS.DEVICE_TOKEN);
        }

        return MixpanelReactNative.setPushRegistrationId(this.token, deviceToken);
    }

    /**
      For Android only
      Retrieve current Firebase Cloud Messaging token.
     */
    getPushRegistrationId(): void {
        if (Helper.getDevicePlatform() !== DevicePlatform.Android) {
            throw new Error(ERROR_MESSAGE.ONLY_FOR_ANDROID);
        }

        return MixpanelReactNative.getPushRegistrationId(this.token);
    }

    /**
      Unregister specific device token from the ability to receive push notifications. This will remove the provided push token saved to user profile.
     */
    clearPushRegistrationId(deviceToken: string): void {
        if (!StringHelper.isValid(deviceToken)) {
            StringHelper.raiseError(PARAMS.DEVICE_TOKEN);
        }

        return MixpanelReactNative.clearPushRegistrationId(this.token, deviceToken);
    }
}