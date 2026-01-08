import type { Express } from "express";
import { createServer, type Server } from "http";
import { type Storage } from "./storage";
import { insertStudentSchema, insertReadingTestSchema, updateStudentSchema, updateReadingTestSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express, storage: Storage): Promise<Server> {
  // Student routes
  app.get("/api/students", async (req, res) => {
    try {
      const students = await storage.getAllStudents();
      res.json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ error: "Failed to fetch students" });
    }
  });

  app.post("/api/students", async (req, res) => {
    try {
      const validatedData = insertStudentSchema.parse(req.body);
      const student = await storage.createStudent(validatedData);
      res.status(201).json(student);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid student data", details: error.errors });
      } else {
        console.error("Error creating student:", error);
        res.status(500).json({ error: "Failed to create student" });
      }
    }
  });

  app.get("/api/students/:id", async (req, res) => {
    try {
      const student = await storage.getStudent(req.params.id);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      console.error("Error fetching student:", error);
      res.status(500).json({ error: "Failed to fetch student" });
    }
  });

  app.patch("/api/students/:id", async (req, res) => {
    try {
      const validatedData = updateStudentSchema.parse(req.body);
      const student = await storage.updateStudent(req.params.id, validatedData);
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.json(student);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid student data", details: error.errors });
      } else {
        console.error("Error updating student:", error);
        res.status(500).json({ error: "Failed to update student" });
      }
    }
  });

  app.delete("/api/students/:id", async (req, res) => {
    try {
      const success = await storage.deleteStudent(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Student not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting student:", error);
      res.status(500).json({ error: "Failed to delete student" });
    }
  });

  app.post("/api/students/:id/keepalive", async (req, res) => {
    try {
      await storage.updateStudentStatus(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error in keepalive:", error);
      res.status(500).json({ error: "Failed to process keepalive" });
    }
  });

  app.get("/api/students/keepalive/by-name/:name", async (req, res) => {
    try {
      const studentsList = await storage.getAllStudents();
      const student = studentsList.find(s => s.name.toLowerCase() === req.params.name.toLowerCase());
      
      if (!student) {
        return res.status(404).json({ error: "Student not found" });
      }

      await storage.updateStudentStatus(student.id);
      res.send(`Keepalive updated for ${student.name}. You can refresh this page to keep them online.`);
    } catch (error) {
      console.error("Error in keepalive by name:", error);
      res.status(500).json({ error: "Failed to process keepalive" });
    }
  });

  // Reading test routes
  app.get("/api/tests", async (req, res) => {
    try {
      const tests = await storage.getAllTests();
      res.json(tests);
    } catch (error) {
      console.error("Error fetching tests:", error);
      res.status(500).json({ error: "Failed to fetch tests" });
    }
  });

  app.get("/api/students/:studentId/tests", async (req, res) => {
    try {
      const tests = await storage.getTestsByStudent(req.params.studentId);
      res.json(tests);
    } catch (error) {
      console.error("Error fetching student tests:", error);
      res.status(500).json({ error: "Failed to fetch student tests" });
    }
  });

  app.post("/api/tests", async (req, res) => {
    try {
      const validatedData = insertReadingTestSchema.parse(req.body);
      
      // Verify student exists
      const student = await storage.getStudent(validatedData.studentId);
      if (!student) {
        return res.status(400).json({ error: "Student does not exist" });
      }
      
      const test = await storage.createReadingTest(validatedData);
      res.status(201).json(test);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid test data", details: error.errors });
      } else {
        console.error("Error creating test:", error);
        res.status(500).json({ error: "Failed to create test" });
      }
    }
  });

  app.patch("/api/tests/:id", async (req, res) => {
    try {
      const validatedData = updateReadingTestSchema.parse(req.body);
      
      // If updating studentId, verify the new student exists
      if (validatedData.studentId) {
        const student = await storage.getStudent(validatedData.studentId);
        if (!student) {
          return res.status(400).json({ error: "Student does not exist" });
        }
      }
      
      const test = await storage.updateReadingTest(req.params.id, validatedData);
      if (!test) {
        return res.status(404).json({ error: "Test not found" });
      }
      res.json(test);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid test data", details: error.errors });
      } else {
        console.error("Error updating test:", error);
        res.status(500).json({ error: "Failed to update test" });
      }
    }
  });

  app.delete("/api/tests/:id", async (req, res) => {
    try {
      const success = await storage.deleteReadingTest(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Test not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting test:", error);
      res.status(500).json({ error: "Failed to delete test" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
