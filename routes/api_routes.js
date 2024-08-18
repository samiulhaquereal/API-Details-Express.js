const express = require("express");
const demoModel = require("../model/demo_model");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("server connected");
});

// route for getting all data
router.get("/all-demo-data", async (req, res) => {
  try {
    const data = await demoModel.find();
    res.status(200).json(data);
  } catch (error) {
    console.log("erro: ", error);
    res.status(400).send("Error in retriving the data.");
  }
});

// route for add demo data
router.post("/add-demo-data", async (req, res) => {
  try {
    const data = req.body;
    const newData = await demoModel.create(data);
    res.status(201).json({
      message: "data created",
      data: newData,
    });
  } catch (error) {
    console.log("Error :: ", error);
  }
});

// route for all data using pagination
router.get("/demoDataList", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
    const limit = parseInt(req.query.limit) || 15; // Default to 15 items per page if not provided

    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: 'Page and limit must be positive numbers' });
    }
    const skip = (page - 1) * limit;
    const data = await demoModel.find().skip(skip).limit(limit);
    const totalDocuments = await demoModel.countDocuments();
    const totalPages = Math.ceil(totalDocuments / limit);
    res.status(200).json({
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalDocuments,
      data: data,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).send("Error retrieving the data.");
  }
});

// route for add data in single time
router.post("/savedemoData", async (req, res) => {
  try {
    const { id } = req.body;

    // Check if already exists
    const existingData = await demoModel.findOne({ id });
    if (existingData) {
      return res.status(200).json({ error: 'Data already exists' });
    }

    // Create and save the new data
    const newData = new demoModel(req.body);
    await newData.save();

    res.status(201).json({
      message: "Info saved",
      data: newData,
    });
  } catch (error) {
    if (error.code === 11000) { // MongoDB duplicate key error code
      res.status(400).json({ error: 'Duplicate entry detected' });
    } else {
      console.error("Error:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
});

// route for fetch data from any api with perameter validation
router.get('/demoData', async (req, res) => {
  const { demoId, demo2Id } = req.query;

  // Validate required query parameters
  if (!semesterId || !studentId) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }

  const apiUrl = `http://demo.com/demo?grecaptcha=&demoId=${demoId}&demo2Id=${demo2Id}`;

  try {
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      return res.status(response.status).json({ error: `Error fetching data: ${response.statusText}` });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching result:', error); // Log the error for debugging
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// route for fetch data from any api
router.get('/demoData', async (req, res) => {
  const apiUrl = 'http://demodata.com/demo/title';

  try {
    
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      return res.status(response.status).json({ error: `Error fetching data: ${response.statusText}` });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching demo data list:', error); // Log the error for debugging
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;