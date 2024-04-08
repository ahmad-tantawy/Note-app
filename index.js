import {
  addNoteButton,
  addPinnedNoteButton, sidebarToggleButton, notesPageButton,
  addPageButton
} from './scripts/elements';
import {
  getDataFromLocalStorage,
  saveDataToLocalStorage,
  clearAndConfirmNoteAdd, validateAddNoteForm, createNoteObject, toggleSidebar
} from './scripts/utils';

// Add a note
function addNote (event) {
  event.preventDefault();

  if (validateAddNoteForm()) {
    const newNote = createNoteObject(event);
    const notesList = getDataFromLocalStorage('notesList') || [];
    notesList.push(newNote);
    saveDataToLocalStorage('notesList', notesList);
    clearAndConfirmNoteAdd();
  }
}

// Toggle Pages
function toggleToAddPage (event) {
  console.log(event.target);
}

function toggleToNotesPage (event) {
  console.log(event.target);
}

// implement event listener for buttons
function initialEventListenersForAddButtons () {
  // Add Event
  addNoteButton.addEventListener('click', addNote);
  addPinnedNoteButton.addEventListener('click', addNote);

  // Toggle Sidebar Event
  sidebarToggleButton.addEventListener('click', toggleSidebar);

  // Pages Button
  notesPageButton.addEventListener('click', toggleToAddPage);
  addPageButton.addEventListener('click', toggleToNotesPage);
}

initialEventListenersForAddButtons();
