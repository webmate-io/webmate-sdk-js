# webmate JavaScript SDK

The webmate SaaS test automation platform provides testing services for testers and developers of web applications.
This SDK contains wrapper code used to call the webmate API from Java applications.

The webmate Java SDK is still under development and maintained regularly.
This release provides wrappers for the following tasks:

* Perform state extraction in an existing browser session, e.g. one that has been created via Selenium.
* Execute a new JobRun in the webmate Job service, e.g. to start a Job comparing the layout of web pages in multiple browsers.
* There is a convenience builder for a BrowserSessionCrossbrowserAnalysis job that may be used to compare the layout of states / web pages from multiple Selenium sessions.
* There is a convenience builder for a BrowserSessionRegressionAnalysis job that may be used to compare the layout of states / web pages from multiple Selenium sessions.

This SDK pre-release gives access to a small subset of the features available in the API. The SDK will be completed over time.

For a complete list of recent changes, please refer to the [changelog](CHANGES.md).


## Using the SDK in your Project

This release is also distributed via npm under the package name webmate-sdk-js.
To use the SDK we recommed to install it via npm:

```bash
$ npm install webmate-sdk-js --save
```

To use the SDK afterwards, import it into your test files as follows:

```js
var webmate = require("webmate-sdk-js");
```

If you're using TypeScript:

```ts
import * as Webmate from "webmate-sdk-js";
```

In TypeScript, you can also import the necessary type-definitions or classes directly:

```ts
import {
    BrowserSessionId,
    BrowserSessionStateExtractionConfig, CrossbrowserJobInput, OptViewPortDimension,
    ProjectId, ScreenshotConfig,
    WarmUpConfig,
    WebmateAPISession, WebmateAuthInfo, WebmateEnvironment
} from "webmate-sdk-js";
```


## Usage

With this SDK, you can automate Selenium testing, as well as CrossBrowser and Regression testing via webmate.
Use 
```js
var webmateSession = Webmate.startSession(MY_WEBMATE_USER, MY_WEBMATE_APIKEY, WEBMATE_API_URL);
```
to connect to the webmate API.

During tests, you can create states using
Use 
```js
webmateSession.browserSession.createState(sessionId, state_name, [timeout], [STATE_EXTRACTION_CONFIG])
```

After executing the tests, you can create a CrossBrowser or Regression job based on your selenium sessions like this:
```js
webmateSession.jobEngine.startKnownJob(test_name, new webmate.CrossbrowserJobInput(firstSession, sessionIds), MY_WEBMATE_PROJECTID)
```

Information about how to build a ```StateExtractionConfig``` can be found at https://github.com/webmate-io/webmate-sdk-java/wiki/BrowserSessionStateExtractionConfig


In order to use this SDK, you need to have an account at webmate SaaS or a commercial on-premise installation.
Please contact Testfabrik (info@testfabrik.com) if you are interested in evaluating webmate.

## webmate API

Although, the SDK provides a number of features and convenience wrappers it doesn't exhaust the full potential of the webmate API.
See the REST API [Swagger documentation](https://app.webmate.io/api/swagger) for a comprehensive summary of the webmate functionalities.
