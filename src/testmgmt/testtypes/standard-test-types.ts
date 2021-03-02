import {TestType} from "./test-type";

class AdHocTestType {
    public readonly testType = new TestType("adhoc");
}

class SeleniumTestType {
    public readonly testType = new TestType("selenium");
}

class LegacyCrossbrowserSingleurlComparison {
    public readonly testType = new TestType("legacy_crossbrowser_singleurl_comparison");
}

class ExpeditionComparison {
    public readonly testType = new TestType("expedition_comparison");
}

class StoryCheck {
    public readonly testType = new TestType("story_check");
}

export class StandardTestTypes {
    public static readonly AdHoc = new AdHocTestType();
    public static readonly Selenium = new SeleniumTestType();
    public static readonly LegacyCrossbrowserSingleurlComparison = new LegacyCrossbrowserSingleurlComparison();
    public static readonly ExpeditionComparison = new ExpeditionComparison();
    public static readonly StoryCheck = new StoryCheck();
}
