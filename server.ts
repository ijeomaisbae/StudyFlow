import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", app: "StudyFlow AI" });
  });

  // AI Assistant endpoint using Gemini
  app.post("/api/ai/generate", async (req, res) => {
    try {
      const { prompt, type, courseTitle } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        // Fallback responses if API key is not configured yet
        if (type === "flashcards") {
          return res.json({
            success: true,
            source: "fallback",
            data: [
              { question: "What is the primary function of mitochondria?", answer: "ATP production through oxidative phosphorylation in cellular respiration." },
              { question: "Define passive vs active transport across cell membranes.", answer: "Passive transport moves substances down their concentration gradient without energy; active transport uses ATP to move substances against gradients." },
              { question: "What occurs during Prophase in mitosis?", answer: "Chromatin condenses into visible chromosomes, nuclear envelope breaks down, and spindle fibers form." }
            ]
          });
        }

        if (type === "study_plan") {
          return res.json({
            success: true,
            source: "fallback",
            reply: `Here is your optimal 45-minute focus session plan for ${courseTitle || "your exam"}:\n\n1. **First 15 mins**: Review key formulas and core principles.\n2. **Next 20 mins**: Work through 3 hard practice problems without notes.\n3. **Final 10 mins**: Summarize key mistakes and active recall points.`
          });
        }

        return res.json({
          success: true,
          source: "fallback",
          reply: `Based on your current study stats and upcoming exams, I recommend allocating 45 minutes to active recall on ${courseTitle || "Calculus Integration"}. Your productivity peaks in the afternoon!`
        });
      }

      // Initialize Gemini SDK lazily
      const ai = new GoogleGenAI({ apiKey });

      let systemPrompt = "You are Serene AI, a supportive, world-class academic AI tutor and study optimization guide for top college students.";
      if (type === "flashcards") {
        systemPrompt += " Generate 3-4 key study flashcards for the given subject. Return ONLY JSON format: [{\"question\":\"...\", \"answer\":\"...\"}]";
      } else if (type === "ai_tutor") {
        systemPrompt += " Act as an empathetic, razor-sharp AI Tutor. Provide clear formatting with bold concepts, bullet points, step-by-step logic, and 1 active-recall challenge question at the end.";
      } else if (type === "burnout_analysis") {
        systemPrompt += " Analyze student workload, fatigue, and sleep stats. Give a compassionate 2-3 sentence assessment with 2 practical recovery steps.";
      } else if (type === "adaptive_planner") {
        systemPrompt += " Generate an optimized study timeline for the student's upcoming week balancing urgent exams and rest periods.";
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          { role: "user", parts: [{ text: `${systemPrompt}\n\nUser Request: ${prompt}` }] }
        ]
      });

      const replyText = response.text || "";

      if (type === "flashcards") {
        try {
          // clean json codeblock if present
          const cleanJson = replyText.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleanJson);
          return res.json({ success: true, source: "gemini", data: parsed });
        } catch {
          return res.json({ success: true, source: "gemini_raw", reply: replyText });
        }
      }

      return res.json({ success: true, source: "gemini", reply: replyText });
    } catch (err: any) {
      console.error("AI Generation Error:", err);
      return res.status(500).json({ error: err.message || "Failed to generate AI response" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StudyFlow server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
