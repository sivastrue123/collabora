const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const cors = require("cors");
const crypto = require("crypto");

const app = express();

// Allow Vue to make requests to this backend
app.use(cors());

// Configure Multer to save uploaded files into an 'uploads' directory
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
// const upload = multer({ dest: uploadDir });
const upload = multer({   dest: uploadDir,   limits: {     fieldSize: 25 * 1024 * 1024, 
  fieldSize: 50 * 1024 * 1024, 
  } });

// In-memory registry to track uploaded files
const fileRegistry = {};
let fileCounter = 1;

// --- NEW: File Upload Endpoint ---
app.post("/upload", upload.single("document"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");

  const fileId = fileCounter++;
  const token = crypto.randomUUID();

  fileRegistry[fileId] = {
    path: req.file.path,
    name: req.file.originalname,
    token: token,
  };

  res.json({ fileId: fileId, token: token });
});

// Middleware for saving from Collabora
app.use(
  "/wopi/files/:id/contents",
  express.raw({ type: "*/*", limit: "50mb" }),
);

// 1. WOPI CheckFileInfo Endpoint (Dynamic)
app.get("/wopi/files/:id", (req, res) => {
  const fileData = fileRegistry[req.params.id];

  if (!fileData || req.query.access_token !== fileData.token) {
    return res.status(401).send("Invalid token");
  }

  // console.log("fileData", fileData, res);
  if (!fileData || !fs.existsSync(fileData.path))
    return res.status(404).send("File not found");

  const postMessageOrigin = "http://localhost:8080";
  const stat = fs.statSync(fileData.path);
  res.json({
    BaseFileName: fileData.name,
    Size: stat.size,
    fileData: fileData,
    UserId: "thanaselvi-local",
    UserFriendlyName: "Thanaselvi", 
    LastModifiedTime: stat.mtime.toISOString(),
    UserCanWrite: true,
    HideUserList: true,
    DisablePrint: true,
    DisableExport: false,
    HideSaveOption: false,
    DownloadAsPostMessage: true,
    SaveAsPostmessage: true,
    DisableWelcome: true,
    DisableInactiveMessages: true,
    PostMessageOrigin: postMessageOrigin,
    SupportsUpdate: true,   // <-- add this
  SupportsLocks: false,

    // --- Enables digital signing UI (Path A) ---
    // UserPrivateInfo: {
    //   SignatureCert: fs.readFileSync(path.join(__dirname, "certs/sign_cert.pem"), "utf8"),
    //   SignatureKey:  fs.readFileSync(path.join(__dirname, "certs/sign_key.pem"), "utf8"),
    //   SignatureCa:   fs.readFileSync(path.join(__dirname, "certs/sign_ca.pem"), "utf8"),
    // },
  });
  // res.json();
});

// 2. WOPI GetFile Endpoint (Dynamic)
app.get("/wopi/files/:id/contents", (req, res) => {
  const fileData = fileRegistry[req.params.id];
  res.sendFile(fileData.path);
});

// 3. WOPI PutFile Endpoint (Dynamic)
app.post("/wopi/files/:id/contents", (req, res) => {
  const fileData = fileRegistry[req.params.id];
  fs.writeFileSync(fileData.path, req.body);
  console.log(`File ${fileData.name} saved successfully11!`);
  res.sendStatus(200);
});

app.listen(5000, () =>
  console.log("Local WOPI Host running on http://localhost:5000"),
);

