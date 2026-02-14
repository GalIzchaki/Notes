import express, { Request, Response } from "express";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(express.static("public"));

const FILE = "notes.json";

type Note = {
  text: string;
  time: string;
};

let notes: Note[] = [];

if (fs.existsSync(FILE)) {
  notes = JSON.parse(fs.readFileSync(FILE, "utf-8"));
}

function saveNotes(): void {
  fs.writeFileSync(FILE, JSON.stringify(notes));
}

app.get("/api/notes", (req: Request, res: Response) => {
  res.json(notes);
});

app.post("/api/notes", (req: Request, res: Response) => {
  const newNote: Note = {
    text: req.body.text,
    time: new Date().toLocaleString()
  };

  notes.push(newNote);
  saveNotes();
  res.json({ success: true });
});

app.delete("/api/notes/:index", (req: Request, res: Response) => {
  const i = Number(req.params.index);
  notes.splice(i, 1);
  saveNotes();
  res.json({ success: true });
});

app.put("/api/notes/:index", (req: Request, res: Response) => {
  const i = Number(req.params.index);

  if (!notes[i]) {
    return res.status(404).json({ error: "Note not found" });
  }

  notes[i].text = req.body.text;
  saveNotes();

  res.json({ success: true });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
