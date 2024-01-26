const express = require("express");
const webpush = require("web-push");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { error } = require("console");

const app = express();
const corsOptions = {
  origin: "*",
  method: "GET, POST, PUT, PATCH, HEAD, DELETE",
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

const port = 4000;

let urlSafeBase64 = (base64String) => {
  return base64String
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const publicVapidKey = urlSafeBase64(
  "BAvKRd4pyXGh1sefKUCSNhk_Dq50bBPxGARCkiVD--ZF9cpk3fZvMSfVKJGE_MCe7QxBUG6mPizmx7gjkAxFg_Q"
);
const privateVapidKey = "SbspKo2OCgnZSdso04McC_aJ3crsKxrt7oWku9S2esc";


webpush.setVapidDetails(
  "mailto:random-mail@example.com",
  publicVapidKey,
  privateVapidKey
);

const dataPath = "./subscription.json";
const readDataFromJson = () => {
    try {
      const jsonData = fs.readFileSync(dataPath, "utf-8");
      return JSON.parse(jsonData);
    } catch (e) {
      console.error("Error reading data from JSON file:", e);
      return { subscriptions: [], datastored: [] };
    }
  };
  
  const writeDataToJson = () => {
    try {
      const jsonData = JSON.stringify(data, null, 2);
      fs.writeFileSync(dataPath, jsonData, "utf-8");
      console.log("Data written to JSON file successfully.");
    } catch (e) {
      console.error("Error writing data to JSON file: ", e);
    }
  };
  
  let data = readDataFromJson(); 

let saveSubscriptionToDatabase = (subscription) => {
    console.log(subscription, data)
  data.subscriptions.push(subscription);
  console.log(data.subscriptions)
  writeDataToJson();
};

let loadSubscriptionFromDatabase = () => {
  return data.subscriptions.length > 0 ? data.subscriptions[0] : null;
};

const payload = {
  notification: {
    title: "Title",
    body: "This is my body",
    icon: "assets/icons/icon-384x384.png",
    actions: [
      { action: "bar", title: "Focus last" },
      { action: "baz", title: "Navigate last" },
    ],
    data: {
      onActionClick: {
        default: { operation: "openWindow" },
        bar: {
          operation: "focusLastFocusedOrOpen",
          url: "/signin",
        },
        baz: {
          operation: "navigateLastFocusedOrOpen",
          url: "/signin",
        },
      },
    },
  },
};

app.post("/post-data", express.json(), (req, res) => {
  const daTa = req.body;
  const dataId = uuidv4();
  const datas = daTa;
  datas.id = dataId;
  data.datastored.push(datas);
  writeDataToJson();
  data.subscriptions.forEach((subscription) => {
    webpush
      .sendNotification(subscription, JSON.stringify(payload))
      .catch((e) => console.error("Error sending notification:", e));
  });
  res.status(201).json({ message: "Data added successfully" });
});

// data.subscriptions.forEach((subscription) => {
//   webpush
//     .sendNotification(subscription, JSON.stringify(payload))
//     .catch((e) => console.error("Error sending notification:", e));
// });

app.post("/subscribe", express.json(), (req, res) => {
    const subscription = req.body;
    saveSubscriptionToDatabase(subscription);
  
    // Use the correct subscription from the request body
    webpush
      .sendNotification(subscription, JSON.stringify(payload))
      .catch((e) => console.error("Error sending notification:", e));
  
    res.status(200).json({ message: "Subscription added successfully" });
  });

if ("development" == app.get("env")) {
  console.log("Rejecting node tls");
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

app.listen(port, () => {
  console.log(`Server is running at  http://localhost:${port}`);
});
