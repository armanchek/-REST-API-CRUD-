const express = require('express');
const app = express();
app.use(express.json()); 

let notes = [];
let noteIdCounter = 1;

const getCurrentDateTime = () => new Date().toISOString();

app.get('/notes', (req, res) => {
    if (notes.length === 0) {
        return res.status(404).json({ message: 'No notes found' });
    }
    res.status(200).json(notes);
});

app.get('/note/:id', (req, res) => {
    const note = notes.find(n => n.id === parseInt(req.params.id));
    if (!note) {
        return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json(note);
});

app.get('/note/read/:title', (req, res) => {
    const note = notes.find(n => n.title === req.params.title);
    if (!note) {
        return res.status(404).json({ message: 'Note not found' });
    }
    res.status(200).json(note);
});

app.post('/note', (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }
    const newNote = {
        id: noteIdCounter++,
        title,
        content,
        created: getCurrentDateTime(),
        changed: getCurrentDateTime()
    };
    notes.push(newNote);
    res.status(201).json(newNote);
});

app.delete('/note/:id', (req, res) => {
    const noteIndex = notes.findIndex(n => n.id === parseInt(req.params.id));
    if (noteIndex === -1) {
        return res.status(404).json({ message: 'Note not found' });
    }
    notes.splice(noteIndex, 1);
    res.status(204).send();
});

app.put('/note/:id', (req, res) => {
    const note = notes.find(n => n.id === parseInt(req.params.id));
    if (!note) {
        return res.status(404).json({ message: 'Note not found' });
    }
    const { title, content } = req.body;
    if (title) note.title = title;
    if (content) note.content = content;
    note.changed = getCurrentDateTime();
    res.status(204).json(note);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
