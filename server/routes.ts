import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFileSchema, insertReasonerSchema, insertScenarioSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "server/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // File routes
  app.get("/api/files", async (req, res) => {
    try {
      const { category, section, fileType, search } = req.query;
      
      let files;
      if (search) {
        files = await storage.searchFiles(
          search as string, 
          category as string, 
          section as string
        );
      } else {
        files = await storage.getFiles(
          category as string, 
          section as string, 
          fileType as string
        );
      }
      
      res.json(files);
    } catch (error) {
      console.error("Error fetching files:", error);
      res.status(500).json({ message: "Failed to fetch files" });
    }
  });

  app.get("/api/files/:id", async (req, res) => {
    try {
      const file = await storage.getFile(req.params.id);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      res.json(file);
    } catch (error) {
      console.error("Error fetching file:", error);
      res.status(500).json({ message: "Failed to fetch file" });
    }
  });

  app.post("/api/files/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const { category, section, fileType, metadata } = req.body;
      
      // Validate required fields
      if (!category || !section || !fileType) {
        return res.status(400).json({ 
          message: "Category, section, and fileType are required" 
        });
      }

      // Determine file type based on mimetype if not provided
      let actualFileType = fileType;
      if (req.file.mimetype.startsWith("image/")) {
        actualFileType = "image";
      } else if (req.file.mimetype === "application/json") {
        actualFileType = "json";
      } else if (req.file.mimetype === "text/plain") {
        actualFileType = "text";
      }

      const fileData = insertFileSchema.parse({
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size.toString(),
        category,
        section,
        fileType: actualFileType,
        metadata: metadata ? JSON.parse(metadata) : null,
      });

      const createdFile = await storage.createFile(fileData);
      res.status(201).json(createdFile);
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  app.get("/api/files/:id/download", async (req, res) => {
    try {
      const file = await storage.getFile(req.params.id);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      const filePath = path.join(uploadDir, file.filename);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "File not found on disk" });
      }

      res.download(filePath, file.originalName);
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ message: "Failed to download file" });
    }
  });

  app.delete("/api/files/:id", async (req, res) => {
    try {
      const file = await storage.getFile(req.params.id);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      // Delete file from disk
      const filePath = path.join(uploadDir, file.filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Delete from storage
      const deleted = await storage.deleteFile(req.params.id);
      if (deleted) {
        res.json({ message: "File deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete file" });
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      res.status(500).json({ message: "Failed to delete file" });
    }
  });

  // Serve uploaded files statically
  app.use("/uploads", (req, res, next) => {
    // Add CORS headers for file serving
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
  // Serve static files from uploads directory
  app.use("/uploads", express.static(uploadDir));

  // Reasoner routes
  app.get("/api/reasoners", async (req, res) => {
    try {
      const { category } = req.query;
      const reasoners = await storage.getReasoners(category as string);
      res.json(reasoners);
    } catch (error) {
      console.error("Error fetching reasoners:", error);
      res.status(500).json({ message: "Failed to fetch reasoners" });
    }
  });

  app.post("/api/reasoners", async (req, res) => {
    try {
      const reasonerData = insertReasonerSchema.parse(req.body);
      const reasoner = await storage.createReasoner(reasonerData);
      res.status(201).json(reasoner);
    } catch (error) {
      console.error("Error creating reasoner:", error);
      res.status(500).json({ message: "Failed to create reasoner" });
    }
  });

  // Scenario routes
  app.get("/api/scenarios", async (req, res) => {
    try {
      const { category, search } = req.query;
      
      let scenarios;
      if (search) {
        scenarios = await storage.searchScenarios(search as string, category as string);
      } else {
        scenarios = await storage.getScenarios(category as string);
      }
      
      res.json(scenarios);
    } catch (error) {
      console.error("Error fetching scenarios:", error);
      res.status(500).json({ message: "Failed to fetch scenarios" });
    }
  });

  app.post("/api/scenarios", async (req, res) => {
    try {
      const scenarioData = insertScenarioSchema.parse(req.body);
      const scenario = await storage.createScenario(scenarioData);
      res.status(201).json(scenario);
    } catch (error) {
      console.error("Error creating scenario:", error);
      res.status(500).json({ message: "Failed to create scenario" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
