const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;

// database
let urlToShortCode = {};
let shortCodeToUrl = {};

// generator
const generateShortCode = () => {
  return Math.random().toString(36).substring(2, 8);
};

// middlewares
app.use(express.json());
app.use(cors());

// apis
app.post("/shorten", (req, res) => {
  const { originalUrl } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ error: "Original URL is required" });
  }

  //   if the shortened URL already exists
  if (urlToShortCode[originalUrl]) {
    return res.json({
      shortUrl: `http://localhost:${port}/${urlToShortCode[originalUrl]}`,
    });
  }

  //   let's generate a new entry
  let shortCode;
  do {
    shortCode = generateShortCode();
  } while (shortCodeToUrl[shortCode]);

  urlToShortCode[originalUrl] = shortCode;
  shortCodeToUrl[shortCode] = originalUrl;

  res.json({ shortUrl: `http://localhost:${port}/${shortCode}` });
});

app.get("/:shortCode", (req, res) => {
  const { shortCode } = req.params;

  const originalUrl = shortCodeToUrl[shortCode];

  if (!originalUrl) {
    return res.status(404).json({ error: "Short URL not found" });
  }

  res.redirect(originalUrl);
});

app.listen(port, () => {
  console.log(`URL shortener service running at http://localhost:${port}`);
});
