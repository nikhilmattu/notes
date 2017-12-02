const storage = window.localStorage;
const NOTES = 'notes';

window.onload = function() {
  var notes;
  notes = JSON.parse(storage.getItem(NOTES) || "[]");

  var renderNotes = function () {
    let container = document.getElementById("notesContainer");

    while(notesContainer.firstChild) {
      notesContainer.removeChild(notesContainer.firstChild);
    }

    for(let note of notes) {
      let noteContainer = document.createElement("div");
      noteContainer.className = "noteContainer";

      let newNote = document.createElement("TEXTAREA");
      newNote.className = "note";
      newNote.innerHTML = note;

      let del = document.createElement("button");
      del.innerHTML = "Delete";

      newNote.addEventListener('click', (e) => {
        e.preventDefault();
        editNote(noteContainer, newNote, del, note);
      })

      del.addEventListener('click', (e) => {
        e.preventDefault();
        deleteNote(noteContainer, note);
      });

      noteContainer.append(newNote);
      noteContainer.append(del);
      container.append(noteContainer);
    }
  }

  renderNotes();

  function deleteNote(element, note) {
    let index = notes.indexOf(note);

    if(index > -1)
      notes.splice(index, 1);

    storage.setItem(NOTES, JSON.stringify(notes));

    renderNotes();
  }

  function editNote(noteContainer, note, del, previous) {
    if(noteContainer.childNodes.length < 3){
      let edit = document.createElement("button");
      edit.innerHTML = "Edit";

      edit.addEventListener('click', (e) => {
        let index = notes.indexOf(previous);
        if(index > -1)
          notes.splice(index, 1);

        notes.unshift(note.value);
        storage.setItem(NOTES, JSON.stringify(notes));
        noteContainer.removeChild(edit);
        renderNotes();
      });

      noteContainer.insertBefore(edit, del);
    }
  }

  var formSubmit = document.querySelector('form').addEventListener('submit', (e) => {
    const newNoteContent = document.getElementById("newNoteText").value;
    e.preventDefault();

    if(notes.length > 0)
      notes.unshift(newNoteContent);
    else
      notes.push(newNoteContent);

    storage.setItem(NOTES, JSON.stringify(notes));
    renderNotes();
    location.reload();
  });
}
