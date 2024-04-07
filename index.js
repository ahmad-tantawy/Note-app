import {
  addNoteButton,
  addPinnedNoteButton,
  noteAuthorInput,
  noteTextInput, noteTitleInput
} from './scripts/elements';
import {
  getDataFromLocalStorage,
  saveDataToLocalStorage,
  isNotePinned, getCurrentDateTime
} from './scripts/utils';

// Reset Form function after Note Addition
function clearAndConfirmNoteAdd () {
  noteTitleInput.value = '';
  noteAuthorInput.value = '';
  noteTextInput.value = '';
  // Show confirmation message
}

// Add a note
function addNote (event) {
  event.preventDefault();

  // Handle Note Id..
  const currentId = getDataFromLocalStorage('id') || 0;
  saveDataToLocalStorage('id', currentId + 1);

  // Handle Date
  const date = getCurrentDateTime();

  // Determine if note should be pinned
  const isPinned = isNotePinned(event.target);

  const note = {
    id: currentId,
    date,
    isPinned,
    title: noteTitleInput.value,
    author: noteAuthorInput.value,
    noteText: noteTextInput.value
  };

  const notes = getDataFromLocalStorage('notes') || [];
  notes.push(note);
  saveDataToLocalStorage('notes', notes);
  clearAndConfirmNoteAdd();
}

// implement event listener for buttons
function initialEventListenersForAddButtons () {
  addNoteButton.addEventListener('click', addNote);
  addPinnedNoteButton.addEventListener('click', addNote);
}

initialEventListenersForAddButtons();
