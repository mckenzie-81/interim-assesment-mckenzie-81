import Crypto from "../models/Crypto.js";

/**
 * Internal function to update prices in the database randomly.
 * This simulates a live market by applying small fluctuations.
 */
const updatePrices = async () => {
  try {
    const cryptos = await Crypto.find();

    for (const crypto of cryptos) {
      // Determine volatility based on coin type
      let volatility = 0.001; // Default 0.1% change per update

      if (crypto.symbol === "BTC" || crypto.symbol === "ETH") {
        volatility = 0.0005; // 0.05% for majors
      } else if (crypto.symbol === "USDT" || crypto.symbol === "USDC") {
        volatility = 0.00005; // Very stable
      } else if (["DOGE", "SOL", "XRP", "ADA"].includes(crypto.symbol)) {
        volatility = 0.003; // 0.3% for more volatile ones
      }

      // Random change between -volatility and +volatility
      const change = (Math.random() - 0.5) * 2 * volatility;

      // Update price
      crypto.price = Math.max(0.000001, crypto.price * (1 + change));

      // Update 24h change (simulated drift)
      crypto.change24h += change * 100;

      // Bound change24h between -15% and +15% for realism in a demo
      if (crypto.change24h > 15) crypto.change24h -= 0.5;
      if (crypto.change24h < -15) crypto.change24h += 0.5;

      // Keep stablecoins close to $1
      if (crypto.symbol === "USDT" || crypto.symbol === "USDC") {
        const drift = (Math.random() - 0.5) * 0.0005;
        crypto.price = 1.0 + drift;
        crypto.change24h = drift * 100;
      }

      await crypto.save();
    }
  } catch (error) {
    console.error("Price simulation error:", error);
  }
};

/**
 * Initializes the background price simulation.
 * Call this once in your server entry file (e.g., server.js).
 */
export const initPriceSimulation = () => {
  // Update every 30 seconds to keep the DB updated without excessive pressure
  setInterval(updatePrices, 3000000);
  console.log("📈 Crypto price simulation started (30s interval)...");
};


// @route   GET /api/crypto
// @desc    Get all cryptocurrencies
// @access  Public
export const getAllCrypto = async (req, res) => {
  try {
    const cryptos = await Crypto.find({ tradable: true }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: cryptos.length,
      data: cryptos,
    });
  } catch (error) {
    console.error("Get all crypto error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
};

// @route   GET /api/crypto/gainers
// @desc    Get top gainers (highest 24h % increase), sorted highest to lowest
// @access  Public
export const getTopGainers = async (req, res) => {
  try {
    const gainers = await Crypto.find({ change24h: { $gt: 0 } }).sort({
      change24h: -1,
    });
    return res.status(200).json({
      success: true,
      count: gainers.length,
      data: gainers,
    });
  } catch (error) {
    console.error("Get gainers error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
};

// @route   GET /api/crypto/new
// @desc    Get newest listings, sorted newest to oldest
// @access  Public
export const getNewListings = async (req, res) => {
  try {
    const newListings = await Crypto.find().sort({ createdAt: -1 }).limit(10);
    return res.status(200).json({
      success: true,
      count: newListings.length,
      data: newListings,
    });
  } catch (error) {
    console.error("Get new listings error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
};

// @route   POST /api/crypto
// @desc    Add a new cryptocurrency
// @access  Public (or protect with middleware if needed)
export const addCrypto = async (req, res) => {
  try {
    const { name, symbol, price, image, change24h, mktCap, volume, tradable } =
      req.body;

    // Validate required fields
    if (!name || !symbol || price === undefined || !image) {
      return res.status(400).json({
        success: false,
        message: "Name, symbol, price, and image are required.",
      });
    }

    // Check for duplicate symbol
    const existing = await Crypto.findOne({
      symbol: symbol.toUpperCase().trim(),
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `A cryptocurrency with symbol "${symbol.toUpperCase()}" already exists.`,
      });
    }

    const crypto = await Crypto.create({
      name,
      symbol,
      price: Number(price),
      image,
      change24h: change24h !== undefined ? Number(change24h) : 0,
      mktCap: mktCap || "N/A",
      volume: volume || "N/A",
      tradable: tradable !== undefined ? Boolean(tradable) : true,
    });

    return res.status(201).json({
      success: true,
      message: `${crypto.name} added successfully!`,
      data: crypto,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ success: false, message: messages[0] });
    }
    console.error("Add crypto error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error. Please try again." });
  }
};
