import {
  addNoteButton, addPinnedNoteButton, sidebarToggleButton,
  notesPageButton, addPageButton, addIconButton, searchFormElement,
  searchInputElement
} from './scripts/elements';
import {
  getDataFromLocalStorage, saveDataToLocalStorage, clearAndConfirmNoteAdd, validateAddNoteForm, createNoteObject, toggleSidebar,
  toggleToNotesPage, toggleToAddPage, initializeApp, handleActivePage, renderNotesList, handleDetailsPageView, draggableNotesHandler, highlightFirstNote
} from './scripts/utils';

// Function to add event listeners to delete buttons
function addDeleteEventListeners () {
  const deleteButtons = document.querySelectorAll('.delete-button');
  deleteButtons.forEach((button) => {
    button.addEventListener('click', deleteButtonClickHandler);
  });
}

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

  // Update the note to be unpinned if the user clicks delete from the PINNED list
  const updateNoteToUnpinned = () => {
    const note = notesList.find(note => note.id.toString() === noteId);
    if (note) {
      // delete animation
      event.target.closest('article').classList.add('deleted');
      setTimeout(() => {
        event.target.closest('article').classList.remove('deleted');
        note.isPinned = false;
        saveDataToLocalStorage('notesList', notesList);
        renderNotesLists();
        addDeleteEventListeners();
      }, 400);
    }
  };

  // Check if the closest note has the class "is-pinned-container"
  if (event.target.closest('.notes-wrapper').classList.contains('is-pinned-container')) {
    updateNoteToUnpinned();
  } else {
    event.target.closest('article').classList.add('deleted');
    setTimeout(() => {
      event.target.closest('article').classList.remove('deleted');
      notesList = notesList.filter(note => note.id.toString() !== noteId);
      saveDataToLocalStorage('notesList', notesList);
      renderNotesLists();
      addDeleteEventListeners();
    }, 400);
  }
}

// implement event listener for buttons
function initialEventListeners () {
  addNoteButton.addEventListener('click', addNote);
  addPinnedNoteButton.addEventListener('click', addNote);
  sidebarToggleButton.addEventListener('click', toggleSidebar);
  notesPageButton.addEventListener('click', toggleToNotesPage);
  addPageButton.addEventListener('click', toggleToAddPage);
  addIconButton.addEventListener('click', toggleToAddPage);

  addDeleteEventListeners();
  searchFormElement.addEventListener('submit', event => {
    event.preventDefault();
    const searchValue = searchInputElement.value;
    if (searchValue) {
      searchHandler(event, searchValue);
      searchInputElement.value = '';
    }
  });

  searchInputElement.addEventListener('focus', () => { searchInputElement.placeholder = 'Search .....🧐'; });
  searchInputElement.addEventListener('blur', () => { searchInputElement.placeholder = 'Search'; });
}

function searchHandler (event, searchValue) {
  event.preventDefault();
  let notesList = getDataFromLocalStorage('notesList');

  const filteredNotes = notesList.filter(note => {
    const isfound = note.title.includes(searchValue) || note.noteText.includes(searchValue) || note.author.includes(searchValue);
    return isfound;
  });

  if (filteredNotes.length > 0) {
    notesList = filteredNotes.concat(notesList.filter(note => !filteredNotes.includes(note)));
    saveDataToLocalStorage('notesList', notesList);
    renderNotesLists();
    highlightFirstNote();
    initialEventListeners();
  }
}

// Render Notes List
function renderNotesLists () {
  const notesList = getDataFromLocalStorage('notesList') || [];

  renderNotesList(notesList, '.sidebar__bottom .notes-wrapper', () => true);
  renderNotesList(notesList, '.sidebar__top .notes-wrapper', (note) => note.isPinned);

  handleDetailsPageView();
  draggableNotesHandler();
}

initializeApp();
handleActivePage();
renderNotesLists();
initialEventListeners();
