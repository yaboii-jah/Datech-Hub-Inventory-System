// =========================
// STATE VARIABLES
// =========================

// Keep the actual data here (no HTML) — easier to maintain
let noteList = [];
let taskNumber = 0;

// =========================
// INITIAL LOAD
// =========================

// Load saved notes from localStorage (if any)
function loadState() {
  noteList = JSON.parse(localStorage.getItem("notedList")) || [];
  taskNumber = noteList.length; // No need to store separately — it's just the length of noteList
}

// Save notes to localStorage
function saveState() {
  localStorage.setItem("notedList", JSON.stringify(noteList));
}

// =========================
// UI RENDERING
// =========================

// This builds the HTML for all notes from noteList
function renderNotes() {
  const gridContainer = document.querySelector('.grid-container');
  gridContainer.innerHTML = ''; // Clear current HTML

  // Create a textarea for each note in noteList
  noteList.forEach((note, index) => {
    const textarea = document.createElement('textarea');
    textarea.className = 'note-container';
    textarea.placeholder = 'Empty Note';
    textarea.value = note.value;

    // Save changes in real-time when typing/pasting
    textarea.addEventListener('input', () => {
      noteList[index].value = textarea.value;
      saveState(); // Keep it in sync with localStorage
    });

    // Delete note on double-click
    textarea.addEventListener('dblclick', () => deleteNote(index));

    gridContainer.appendChild(textarea);
  });

  // Add "plus" button at the end
  const addBtn = document.createElement('button');
  addBtn.className = 'add';
  addBtn.textContent = '+';
  addBtn.addEventListener('click', addTask);

  gridContainer.appendChild(addBtn);
}

// =========================
// NOTE OPERATIONS
// =========================

// Add a new note
function addTask() {
  noteList.push({ id: Date.now(), value: '' }); // Use unique ID
  taskNumber = noteList.length;
  saveState();
  renderNotes();
}

// Delete a note
function deleteNote(index) {
  const choice = confirm('Do you want to delete this note?');
  if (choice) {
    noteList.splice(index, 1);
    taskNumber = noteList.length;
    saveState();
    renderNotes();
  }
}

// =========================
// INITIALIZATION
// =========================
loadState();
renderNotes();