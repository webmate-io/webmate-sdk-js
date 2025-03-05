# Changelog

All notable changes to the webmate JavaScript SDK will be documented in this file.

## [0.30.1] - 2025-03-05
### Fixes
- Fix error when uploading large packages to webmate

## [0.30.0] - 2024-02-05
### New
- A function in the device client to configure the simulation of biometric authentication
- Functions to retrieve the browser session info (including the device id) for a running Selenium test

## [0.29.10] - 2024-01-16
### Fixes
- Wait for test run creation/completion to finish
  - Functions to create or finish a test run are now blocking
  - Selenium actions will no longer go missing

## [0.29.9] - 2023-09-26
### Fixes
- Compatibility change for webmate release 2023.4.0

## [0.29.8] - 2023-07-11
- Fix problem where testmails could not be created

## [0.29.3] - 2021-04-09
- Fixed structure of test run device info.

## [0.29.0] - 2021-02-22

###New
- Major overhaul of SDK

## [0.28.0] - 2020-02-11

###New
- Synchronized versioning with webmate Java SDK
- Added artifact functionality
    -  Users can query and retrieve artifacts
- Added functionality to terminate a BrowserSession
- Added device functionality
    - Users can query existing devices for a project
    - Users can query available templates for a project
    - Users can create, delete, redeploy and synchronize a device
- Added functionality to query existing jobs for a project
- Added Mailtest functionality
    - Users can request a mail address that they can use during a test
    - Users can also retrieve Mails that are sent to this address to execute additional tests on the mail

