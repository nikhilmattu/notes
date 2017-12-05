const storage = window.localStorage;
const NOTES = "myNotes";
const ID = "notesId";
const notes = JSON.parse(storage.getItem(NOTES) || "[]");
let id = JSON.parse(storage.getItem(ID) || "0");
const filters = {
  COMPLETED: 'completed',
  INCOMPLETE: 'incomplete',
  ALL: 'all',
};
let currentFilter;

class Note {
  constructor(id, content, createdDate, lastEditedDate, completed = false) {
    this.id = id;
    this.content = content;
    this.createdDate = createdDate;
    this.lastEditedDate = lastEditedDate;
    this.completed = completed;
  }
}

const renderNotes = function () {
  const container = document.getElementById("notesContainer");

  while(container.firstChild) {
    container.removeChild(notesContainer.firstChild);
  }

  notes.forEach(note => {
    switch (currentFilter) {
      case filters.ALL:
        const newNote = createNote(note);
        container.append(newNote);
        break;
      case filters.COMPLETED:
        if(note.completed){
          const newNote = createNote(note);
          container.append(newNote);
        }
        break;
      case filters.INCOMPLETE:
        if(!note.completed){
          const newNote = createNote(note);
          container.append(newNote);
        }
        break;
      default:
        console.log("This should never happen!");
    }
  });
}

const createNote = function (note) {
  const noteContainer = document.createElement("div");
  noteContainer.className = "noteContainer";

  const newNote = document.createElement("TEXTAREA");
  newNote.className = "noteContent";
  newNote.innerText = note.content;
  newNote.id = `note${note.id}`;

  newNote.addEventListener('blur', (e) =>{
    saveNote(note.id);
  });

  const deleteButton = document.createElement("button");
  deleteButton.className = "deleteButton";

  deleteButton.addEventListener('click', (e) => {
    deleteNote(note.id);
  });

  const noteInfo = document.createElement("div");
  noteInfo.className = "noteInfo";
  noteInfo.innerText = note.completed ?
  `Completed: ${note.lastEditedDate}
  Created: ${note.createdDate}` :
  `Last Edited: ${note.lastEditedDate}
  Created: ${note.createdDate}`;

  if(note.completed){
    const incompleteButton = document.createElement("button");
    incompleteButton.className = "incompleteButton";

    incompleteButton.addEventListener('click', (e) => {
      markIncomplete(note.id);
    });
    noteContainer.append(incompleteButton);
  }

  if(!note.completed){
    const completeButton = document.createElement("button");
    completeButton.className = "completeButton";

    completeButton.addEventListener('click', (e) => {
      markComplete(note.id);
    });
    noteContainer.append(completeButton);
  }

  noteContainer.append(deleteButton);
  noteContainer.append(newNote);
  noteContainer.append(noteInfo);

  return noteContainer;
}

const saveNote = function(id) {
  const note = document.getElementById(`note${id}`);
  const noteContent = note.value;

  // If note is emptied, assumption is being made that it is being deleted
  if(noteContent === ""){
    deleteNote(id);
    return;
  }

  const newContent = noteContent.trim();

  let index = notes.map(function(note){
    return note.id;
  }).indexOf(id);

  notes[index].content = newContent;
  notes[index].lastEditedDate = new Date().toUTCString();

  note.value = newContent;
  storage.setItem(NOTES, JSON.stringify(notes));
}

const deleteNote = function(id) {
  let index = notes.map(function(note) {
    return note.id;
  }).indexOf(id);

  notes.splice(index, 1);

  storage.setItem(NOTES, JSON.stringify(notes));
  renderNotes();
}

const markComplete = function(id) {
  let index = notes.map(function(note) {
    return note.id;
  }).indexOf(id);

  notes[index].completed = true;
  notes[index].lastEditedDate = new Date().toUTCString();

  storage.setItem(NOTES, JSON.stringify(notes));
  renderNotes();
}

const markIncomplete = function(id) {
  let index = notes.map(function(note) {
    return note.id;
  }).indexOf(id);

  notes[index].completed = false;
  notes[index].lastEditedDate = new Date().toUTCString();

  storage.setItem(NOTES, JSON.stringify(notes));
  renderNotes();
}

const setFilter = function(filter) {
  let previousFilterButton = document.getElementById(currentFilter);
  previousFilterButton.className = "";

  let currentFilterButton = document.getElementById(filter);
  currentFilterButton.className = "activeFilter";

  currentFilter = filter;
  renderNotes();
}

window.onload = function() {
  currentFilter = filters.ALL;
  let filterButton = document.getElementById(filters.ALL);
  filterButton.className = "activeFilter";

  renderNotes();

  const form = document.getElementById("createNoteForm");

  const formSubmit = form.addEventListener("submit", (e) => {
    e.preventDefault(); // Allows for form to be focused after submit
    const content = document.getElementById("newNoteText").value;
    const date = new Date().toUTCString();
    const note = new Note(id, content.trim(), date, date);

    id++;

    notes.unshift(note);
    storage.setItem(NOTES, JSON.stringify(notes));
    storage.setItem(ID, JSON.stringify(id));
    form.reset();
    renderNotes();
  });
}
