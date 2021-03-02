/**
 * WebmateCapabilityType define custom webmate capabilities.
 */
export class WebmateCapabilityType {

    /**
     * Email for the user account.
     */
    public static readonly USERNAME = "email";

    /**
     * Api key that is associated with the user account. Note that the email and
     * api key need to belong to the same user account.
     */
    public static readonly API_KEY = "apikey";

    /**
     * The project id of a project that is created for the passed email.
     */
    public static readonly PROJECT = "project";

    /**
     * Enable video recording.
     */
    public static readonly ENABLE_VIDEO_RECORDING = "wm:video";

    /**
     * Disable video recording.
     */
    public static readonly PREVENT_VIDEO_RECORDING = "wm:noVideo";

    public static readonly AUTOMATION_SCREENSHOTS = "wm:autoScreenshots";
}
