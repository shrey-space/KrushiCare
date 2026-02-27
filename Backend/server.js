const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

const API_KEY = "579b464db66ec23bdd00000156c8041690bd45956332eabf01fe61eb";

app.get("/market", async (req, res) => {
  try {
    const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${API_KEY}&format=json&limit=500`;

    const response = await axios.get(url);
    const records = response.data.records;

    // Find any onion from Maharashtra (flexible search)
    const onion = records.find(r => {
      const commodity = (r.commodity || "").toLowerCase();
      const state = (r.state || "").toLowerCase();

      return commodity.includes("onion") && state.includes("maharashtra");
    });

    if (!onion) {
      console.log("No Onion data found in Maharashtra");
      return res.json({
        crop: "Onion",
        price: 0,
        yesterday: 0
      });
    }

    const price = parseInt(onion.modal_price) || 0;

    res.json({
      crop: onion.commodity,
      price: price,
      yesterday: price - 40
    });

  } catch (err) {
    console.log("Market fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch market data" });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});