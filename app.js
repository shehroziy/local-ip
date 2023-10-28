require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();

// app.use();
const allowlist = process.env.ALLOWLIST ? process.env.ALLOWLIST.split(",") : [];
// console.log(allowlist);
app.get(
  "/",
  async (req, res, next) => {
    try {
      const ip = req.headers["remote_addr"] || req.headers["x-real-ip"];
      const response = await axios.get("https://api.country.is/" + ip);
      console.log(allowlist);
      console.log(req.headers);
      console.log(response.data);
      if ([200, 201].includes(response.status)) {
        //   console.log(response.data.country);
        if (allowlist.includes(response.data.country)) {
          next();
          return;
        }
        return res.status(500).json({
          status: 500,
          message: "service anavailability",
        });
      }
    } catch (error) {
      console.log(error.message);
      console.log(error?.response);
    }
  },
  async (req, res) => {
    return res.status(200).json({
      status: 200,
      message: "success message",
    });
  }
);

app.listen("3000", () => {
  console.log("server listening on http://localhost:3000");
});
