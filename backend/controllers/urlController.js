const Url = require("../models/Url");
const validator = require("validator");
const { nanoid } = require("nanoid");


// CREATE SHORT URL
exports.createShortUrl = async (req, res) => {

    try {

        const { originalUrl } = req.body;

        // Validate URL
        if (!validator.isURL(originalUrl)) {

            return res.status(400).json({
                message: "Invalid URL",
            });

        }

        // Check if URL already exists for this user
        const existingUrl = await Url.findOne({
            originalUrl,
            userId: req.user.id,
        });

        if (existingUrl) {

            const protocol = req.protocol || 'http';
            const host = req.get('host') || 'localhost:5000';
            
            return res.status(200).json({
                message: "URL already exists",
                shortUrl: `${protocol}://${host}/${existingUrl.shortCode}`,
                data: existingUrl,
            });

        }

        // Generate short code
        const shortCode = nanoid(6);

        // Save URL
        const newUrl = await Url.create({

            userId: req.user.id,
            originalUrl,
            shortCode,

        });

        res.status(201).json({
            message: "Short URL created",
            shortUrl: `${req.protocol}://${req.get('host')}/${shortCode}`,
            data: newUrl,
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};

exports.redirectUrl = async (req, res) => {

    try {

        const { shortCode } = req.params;

        // Find URL
        const url = await Url.findOne({ shortCode });

        if (!url) {

            return res.status(404).json({
                message: "URL not found",
            });

        }

        // Increase click count
        url.clicks += 1;

        await url.save();

        // Redirect
        res.redirect(url.originalUrl);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};

exports.getMyUrls = async (req, res) => {

    try {

        // Find URLs created by logged-in user
        const urls = await Url.find({
            userId: req.user.id,
        }).sort({ createdAt: -1 });

        res.status(200).json(urls);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};

exports.deleteUrl = async (req, res) => {

    try {

        const { id } = req.params;

        // Find URL
        const url = await Url.findById(id);

        // Check if URL exists
        if (!url) {

            return res.status(404).json({
                message: "URL not found",
            });

        }

        // Security check
        if (url.userId.toString() !== req.user.id) {

            return res.status(403).json({
                message: "Unauthorized",
            });

        }

        // Delete URL
        await url.deleteOne();

        res.status(200).json({
            message: "URL deleted successfully",
        });

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });

    }

};