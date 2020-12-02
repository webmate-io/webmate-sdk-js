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
}
