# webmate JavaScript and TypeScript SDK [![Build Status](https://www.travis-ci.com/webmate-io/webmate-sdk-js.svg?branch=master)](https://www.travis-ci.com/webmate-io/webmate-sdk-js) ![npm](https://img.shields.io/npm/v/webmate-sdk-js)

The webmate SaaS test automation platform provides testing services for testers and developers of web applications.
This SDK contains wrapper code used to call the webmate API from JavaScript and TypeScript applications.

The webmate JavaScript and TypeScript SDK is still under development and maintained regularly.
This release provides wrappers for the following tasks:

* Perform state extraction in an existing browser session, e.g. one that has been created via Selenium.
* Execute a new JobRun in the webmate Job service, e.g. to start a Job comparing the layout of web pages in multiple browsers.
* There is a convenience builder for a BrowserSessionCrossbrowserAnalysis job that may be used to compare the layout of states / web pages from multiple Selenium sessions.
* There is a convenience builder for a BrowserSessionRegressionAnalysis job that may be used to compare the layout of states / web pages from multiple Selenium sessions.

For a complete list of recent changes, please refer to the [changelog](CHANGES.md).


## Using the SDK in your Project

This release is also distributed via npm under the package name webmate-sdk-js.
To use the SDK we recommend to install it via npm:

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


## Sample Code

See the following sample projects:
* [Java Samples](https://github.com/webmate-io/webmate-sdk-samples)
* [JavaScript And TypeScript Samples](https://github.com/webmate-io/webmate-sdk-js-samples)

In order to use these samples, you need to have an account at webmate SaaS or a commercial on-premise installation.
Please contact Testfabrik (info@testfabrik.com) if you are interested in evaluating webmate.


## Usage

In order to use this SDK, you need to have an account at webmate SaaS or a commercial on-premise installation.
Please contact Testfabrik (info@testfabrik.com) if you are interested in evaluating webmate.


## webmate API

Although, the SDK provides a number of features and convenience wrappers it doesn't exhaust the full potential of the webmate API.
See the REST API [Swagger documentation](https://app.webmate.io/api/swagger) for a comprehensive summary of the webmate functionalities.
