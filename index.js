import {
  addNoteButton, addPinnedNoteButton, sidebarToggleButton, notesPageButton, addPageButton,
  addIconButton, searchFormElement, searchInputElement, toggleFormElement, menuIconElement,
  closeSidebarIcon, detailsPageElement, searchInputElementForMobile, searchFormElementForMobile
} from './scripts/elements';
import {
  getDataFromLocalStorage, saveDataToLocalStorage, clearAndConfirmNoteAdd, validateAddNoteForm,
  createNoteObject, toggleSidebar, toggleToNotesPage, toggleToAddPage, initializeApp, handleActivePage,
  renderNotesList, handleDetailsPageView, draggableNotesHandler, highlightFirstNote, toggleNotesAndDetailsDisplay,
  toggleFormHandler, toggleAsideHandler, handleSearchInputFocus
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

// Add event listener for search form submission on PC
function addSearchFormEventListenerPC () {
  searchFormElement.addEventListener('submit', event => {
    event.preventDefault();
    const searchValue = searchInputElement.value;
    if (searchValue) {
      searchHandler(event, searchValue);
      setTimeout(() => {
        searchInputElement.value = '';
      }, 1500);
    }
  });
}

// Add event listener for search form submission on mobile
function addSearchFormEventListenerMobile () {
  searchFormElementForMobile.addEventListener('submit', event => {
    event.preventDefault();
    const searchValue = searchInputElementForMobile.value;
    if (searchValue) {
      searchHandler(event, searchValue);
      setTimeout(() => {
        searchInputElementForMobile.value = '';
      }, 1500);
    }
  });
}

// Implement event listeners for buttons
function initialEventListeners () {
  // Adding notes
  addNoteButton.addEventListener('click', addNote);
  addPinnedNoteButton.addEventListener('click', addNote);
  // Toggling sidebar
  sidebarToggleButton.addEventListener('click', toggleSidebar);
  // Toggling between notes and add page
  notesPageButton.addEventListener('click', toggleToNotesPage);
  addPageButton.addEventListener('click', toggleToAddPage);
  addIconButton.addEventListener('click', toggleToAddPage);
  // Events specific to mobile devices 'for responsive'
  toggleFormElement.addEventListener('click', toggleFormHandler);
  menuIconElement.addEventListener('click', toggleAsideHandler);
  closeSidebarIcon.addEventListener('click', toggleAsideHandler);
  detailsPageElement.addEventListener('click', toggleNotesAndDetailsDisplay);
  // Add delete event listeners
  addDeleteEventListeners();
  // Add event listener for search form submission
  addSearchFormEventListenerPC();
  addSearchFormEventListenerMobile();
  // Add event listeners for search input focus and blur 'just for feedback'
  handleSearchInputFocus();
}

function searchHandler (event, searchValue) {
  event.preventDefault();
  let notesList = getDataFromLocalStorage('notesList');

  const filteredNotes = notesList.filter(note => {
    const isfound = note.title.includes(searchValue) || note.author.includes(searchValue) || note.noteText.includes(searchValue);
    return isfound;
  });

  if (filteredNotes.length > 0) {
    notesList = filteredNotes.concat(notesList.filter(note => !filteredNotes.includes(note)));
    saveDataToLocalStorage('notesList', notesList);
    renderNotesLists();
    highlightFirstNote();
    initialEventListeners();
  } else {
    searchInputElement.value = 'Sorry, not found! 🐸';
    searchInputElementForMobile.value = 'Sorry, not found! 🐸';
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
