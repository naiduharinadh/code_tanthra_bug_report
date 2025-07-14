const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb+srv://s190462:Munna123@cluster0.aihmken.mongodb.net/UserDBCodeTantra_Support_clientDB')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const supportRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  issue: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const SupportRequest = mongoose.model("SupportRequest", supportRequestSchema);

app.post("/submit-support", async (req, res) => {
  try {
    const { name, email, issue, priority } = req.body;
    
    const newSupportRequest = new SupportRequest({
      name,
      email,
      issue,
      priority
    });

    await newSupportRequest.save();
    res.json({ 
      success: true, 
      message: "Support request submitted successfully!" 
    });
  } catch (error) {
    console.error('Error saving support request:', error);
    res.status(500).json({ 
      success: false, 
      error: "Error submitting support request" 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

