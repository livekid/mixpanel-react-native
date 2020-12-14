import packageJson from "../package.json";
import DevicePlatform from '../DevicePlatform'
import { Platform } from "react-native"

export default class Helper {
    /**
      Get the library data from package.json file.
     */
    static getMetaData(): any {
        let metadata = JSON.parse(JSON.stringify(packageJson.metadata));
        metadata["$lib_version"] = packageJson.version;
        return metadata;
    }

    /**
      Get current device platform.
     */
    static getDevicePlatform(): string {
        switch (Platform.OS) {
            case "android":
                return DevicePlatform.Android;
            case "ios":
                return DevicePlatform.iOS;
            default:
                return DevicePlatform.Unknown;
        }
    }
}