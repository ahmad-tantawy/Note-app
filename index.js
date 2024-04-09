import {
  addNoteButton, addPinnedNoteButton, sidebarToggleButton,
  notesPageButton, addPageButton
} from './scripts/elements';
import {
  getDataFromLocalStorage, saveDataToLocalStorage, clearAndConfirmNoteAdd, validateAddNoteForm, createNoteObject, toggleSidebar,
  toggleToNotesPage, toggleToAddPage, initializeApp,
  handleActivePage, renderNotesList
} from './scripts/utils';

// Add a note
function addNote (event) {
  event.preventDefault();

  if (validateAddNoteForm()) {
    const newNote = createNoteObject(event);
    const notesList = getDataFromLocalStorage('notesList') || [];
    notesList.unshift(newNote);
    saveDataToLocalStorage('notesList', notesList);
    clearAndConfirmNoteAdd();
    renderNotesLists();
    addDeleteEventListeners();
  }
}

// Function to handle delete button clicks
function deleteButtonClickHandler (event) {
  const noteId = event.target.closest('.note').getAttribute('data-key');
  let notesList = getDataFromLocalStorage('notesList');

  notesList = notesList.filter(note => note.id.toString() !== noteId);
  saveDataToLocalStorage('notesList', notesList);
  renderNotesLists();
  addDeleteEventListeners();
}

// Function to add event listeners to delete buttons
function addDeleteEventListeners () {
  const deleteButtons = document.querySelectorAll('.delete-button');
  deleteButtons.forEach((button) => {
    button.addEventListener('click', deleteButtonClickHandler);
  });
}

// implement event listener for buttons
function initialEventListeners () {
  // Add Event
  addNoteButton.addEventListener('click', addNote);
  addPinnedNoteButton.addEventListener('click', addNote);

  // Toggle Sidebar Event
  sidebarToggleButton.addEventListener('click', toggleSidebar);

  // Pages Button
  notesPageButton.addEventListener('click', toggleToNotesPage);
  addPageButton.addEventListener('click', toggleToAddPage);

  // Add event listeners to delete buttons
  addDeleteEventListeners();
}

// Render Notes List
function renderNotesLists () {
  const notesList = getDataFromLocalStorage('notesList') || [];

  renderNotesList(notesList, '.sidebar__bottom .notes-wrapper', () => true);
  renderNotesList(notesList, '.sidebar__top .notes-wrapper', (note) => note.isPinned);
}

initializeApp();
handleActivePage();
renderNotesLists();
initialEventListeners();
