const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createShortUrl,
  redirectUrl,
  getMyUrls,
  deleteUrl
} = require("../controllers/urlController");


// Protected Route
router.post(
  "/shorten",
  authMiddleware,
  createShortUrl
);

router.get(
  "/myurls",
  authMiddleware,
  getMyUrls
);

router.delete(
  "/:id",
  authMiddleware,
  deleteUrl
);

module.exports = router;