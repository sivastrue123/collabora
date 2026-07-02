Here are the various keys, parameters, and properties you can use across Collabora's APIs, categorized by their function:

**1. WOPI CheckFileInfo API Properties**
When Collabora (the WOPI client) queries your server (the WOPI host) about a file, your endpoint should return a JSON object. You can use the following keys in that response to control features, permissions, and UI elements:

- **Essential File & User Keys:**
  - **`BaseFileName`**: The string name of the file without its path.
  - **`Size`**: The size of the file in bytes.
  - **`OwnerId`**: A string identifying the file's owner.
  - **`UserId`**: A string identifying the user currently accessing the file.
  - **`UserFriendlyName`**: The display name of the user.
- **Permissions & User Roles:**
  - **`UserCanWrite`**: Boolean indicating if the user can edit the file.
  - **`UserCanNotWriteRelative`**: Boolean to prevent the user from performing a "Save As" on your server.
  - **`SupportsRename`** and **`UserCanRename`**: Booleans to allow the UI to display renaming options.
  - **`IsAdminUser`**: Boolean indicating if the user has administrator rights.
  - **`IsAnonymousUser`**: Boolean indicating if the user is unauthenticated/a guest.
  - **`UserCanOnlyComment`** / **`UserCanOnlyManageRedlines`**: Booleans that restrict the user to only adding comments or managing tracked changes.
  - **`IsUserLocked`** / **`IsUserRestricted`**: Used to lock or disable certain features for a user.
- **UI Customization & Feature Toggles:**
  - **`HidePrintOption`**, **`DisablePrint`**: Hides or entirely disables printing.
  - **`HideSaveOption`**, **`HideExportOption`**, **`DisableExport`**: Hides or disables saving and exporting capabilities.
  - **`DisableCopy`**: Disables copying text from the document.
  - **`HideRepairOption`**: Hides the repair button.
  - **`EnableInsertRemoteImage`**, **`EnableInsertRemoteFile`**, **`EnableRemoteLinkPicker`**, **`EnableRemoteAIContent`**: Booleans to allow inserting content natively from the WOPI storage/host.
  - **`DisableInsertLocalImage`**: Prevents inserting images from the user's local device.
  - **`DisableInactiveMessages`**: Stops displaying overlay explanations when a document becomes inactive.
  - **`WatermarkText`**: Used to render a watermark on every tile of the document.
- **Advanced Actions:**
  - **`TemplateSource`**: A URL used to create a new file from a template.
  - **`DownloadAsPostMessage`** / **`SaveAsPostmessage`**: Tells the integration to handle downloads or "Save As" actions via a postMessage rather than relying on browser downloads.
  - **`EnableOwnerTermination`**: Allows the document owner to terminate all active sessions.
  - **`LastModifiedTime`**: Used to resolve conflicts by checking the file's last modified time in storage.

**2. Additional Information JSON Keys (Nested within CheckFileInfo)**
You can pass nested JSON objects inside the CheckFileInfo response for advanced functionalities:

- **`UserExtraInfo`**: Can contain **`avatar`** (URL to a profile picture) and **`mail`** (user's email).
- **`UserPrivateInfo`**: Can hold per-user secrets like API keys. For document signing, it uses the keys **`SignatureCert`**, **`SignatureKey`**, and **`SignatureCa`**.
- **`ServerPrivateInfo`**: Holds per-server credentials. For electronic signing, use the keys **`ESignatureBaseUrl`**, **`ESignatureClientId`**, and **`ESignatureSecret`**.
- **`UserSettings`** / **`SharedSettings`**: Used for the Settings iframe. These objects expect the keys **`uri`** (URL to fetch the settings) and **`stamp`** (a hash/timestamp to manage caching). When formatting the settings JSON, you will also use keys like **`kind`**, **`autotext`**, **`xcu`**, **`browsersetting`**, and **`themes`**.

**3. API HTTP Headers (For Save & Rename Operations)**
When Collabora saves or modifies a document, it includes specific headers in its requests to your WOPI host:

- **`X-COOL-WOPI-IsModifiedByUser`**: `true` or `false` based on whether the user manually modified the document before saving.
- **`X-COOL-WOPI-IsAutosave`**: `true` if the save was triggered automatically.
- **`X-COOL-WOPI-IsExitSave`**: `true` if the document is being saved because it is being cleaned from memory (e.g., all users disconnected).
- **`X-COOL-WOPI-Timestamp`**: The timestamp of the file as known by Collabora, used to check for external document changes.
- **`X-WOPI-Override`**: Used to override the HTTP method, taking values like `PUT_FILE` (for Save As) or `RENAME_FILE`.
- **`X-WOPI-SuggestedTarget`**: The full target filename for a Save As operation.
- **`X-WOPI-RequestedName`**: The newly requested filename (without extension) for a rename operation.

**4. URL Query Parameters for the Iframe**
When constructing the URL to embed the Collabora editor, you can append these query parameter keys:

- **`closebutton`**: Displays a close button that emits a `UI_Close` message (`true`/`false`).
- **`revisionhistory`**: Adds a "See history" option in the UI (`true`/`false`).
- **`target`**: Focuses on a specific section/element upon loading.
- **`timestamp`**: Passes the modification time to the server.
- **`startPresentation`**: Automatically starts Impress documents in presentation mode.
- **`lang`**: Manually overwrites the UI language (e.g., `lang=fr`).
- **`permission`**: E.g., `permission=readonly` to load in a view-only state.
- **`debug`** / **`randomUser`**: Enables debug controls or loads a random language for testing.

**5. Conversion API Parameters**
If you are using Collabora's Conversion API to convert document formats, you can pass these optional parameter keys:

- **`lang`**: The language locale.
- **`options`**: Advanced export filter options (e.g., for PDF or CSV parameters).
- **`infilterOptions`**: Import filter options.
- **`template`**: Template option.
- **`compare`**: Compare option.
- _Note: `PDFVer` and `FullSheetPreview` are currently deprecated_.
