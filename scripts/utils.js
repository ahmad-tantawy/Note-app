import {
  noteAuthorInput,
  noteTextInput,
  noteTitleInput,
  confirmationMessage, notesPage, addPage, addPageButton
  , notesPageButton, NoteDetailsWrapElement
} from './elements';

/* eslint-disable */
// Add a note to local storage
export function saveDataToLocalStorage (key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Get notes from local storage
export function getDataFromLocalStorage (key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : false;
}
/* eslint-enable */

// Is note should be pinned
export function isNotePinned (button) {
  return JSON.parse(button.getAttribute('data-key'));
}

// Get Date
export function getCurrentDateTime () {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const year = now.getFullYear();
  const month = months[now.getMonth()];
  const day = String(now.getDate()).padStart(2, '0');

  const dateTime = `${month} ${day}, ${year}`;
  return dateTime;
}

// Reset Form function after Note Addition
export function clearAndConfirmNoteAdd () {
  noteTitleInput.value = '';
  noteAuthorInput.value = '';
  noteTextInput.value = '';
  // Show confirmation message
  confirmationMessage.style.display = 'block';

  setTimeout(function () {
    confirmationMessage.style.display = 'none';
  }, 3000);
}

// Validate form fields
export function validateAddNoteForm () {
  const inputFields = [
    noteTitleInput,
    noteAuthorInput,
    noteTextInput
  ];

  for (const input of inputFields) {
    if (input.value.trim() === '') {
      input.classList.add('required-input');
      setTimeout(function () {
        input.classList.remove('required-input');
      }, 3000);
      return false;
    }
  }
  return true;
}

// Function to create a new note object
export function createNoteObject (event) {
  const date = getCurrentDateTime();
  const isPinned = isNotePinned(event.target);
  const currentId = getDataFromLocalStorage('id') || 0;
  saveDataToLocalStorage('id', currentId + 1);

  return {
    date,
    isPinned,
    id: currentId,
    title: noteTitleInput.value,
    author: noteAuthorInput.value,
    noteText: noteTextInput.value
  };
}

// Toggle Sidebar callback function
export function toggleSidebar (event) {
  const sidebar = event.target.closest('.sidebar');
  sidebar.classList.toggle('toggled');
}

// Toggle Pages
export function toggleToAddPage (event) {
  saveDataToLocalStorage('isNotesPage', false);
  addPageButton.classList.remove('not-active');
  notesPageButton.classList.add('not-active');
  notesPage.classList.remove('active-page');
  addPage.classList.add('active-page');
}

export function toggleToNotesPage (event) {
  saveDataToLocalStorage('isNotesPage', true);
  notesPageButton.classList.remove('not-active');
  addPageButton.classList.add('not-active');
  addPage.classList.remove('active-page');
  notesPage.classList.add('active-page');
}

// Handle Active Page
export function handleActivePage () {
  if (getDataFromLocalStorage('isNotesPage')) {
    toggleToNotesPage();
  } else {
    toggleToAddPage();
  }
}

/* eslint-disable */
// Initial Page
export const initializeApp = () => {
  if (!localStorage.getItem('isNotesPage')) {
    saveDataToLocalStorage('isNotesPage', true);
  }
};
/* eslint-enable */

// Render Notes List
export function renderNotesList (notesList, containerSelector, filterFunction) {
  let notes = '';
  notesList.forEach((note) => {
    if (filterFunction(note)) {
      const isPinnedClass = note.isPinned ? 'pinned-note' : '';

      notes += `
        <article class="draggable note ${isPinnedClass}" data-key="${note.id}" draggable="true">
          <h3 class="note-title">${note.title}</h3>
          <p class="note-content">
            ${note.noteText}
          </p>
          <div class="note-footer">
            <p class="publish-date">${note.date} <span class="note-author">${note.author}</span></p>
            <button class="delete-button">Delete</button>
          </div>
       </article>
      `;
    }
  });

  const notesWrapper = document.querySelector(containerSelector);
  notesWrapper.innerHTML = notes;
}

// Function to retrieve the previous note ID from local storage
export function getPreviousNoteId () {
  return getDataFromLocalStorage('previousNoteId') || null;
}

// Function to check if a note with the given ID exists in the notes list
export function isNoteExist (noteId, notesList) {
  return notesList.some((note) => note.id.toString() === noteId);
}

// Function to retrieve the note with the given ID from the notes list
export function getNoteById (noteId, notesList) {
  return notesList.find((note) => note.id.toString() === noteId);
}

// Function to render the note details
export function renderNoteDetails (note) {
  if (!note) return;

  const createdNote = `
    <article class="note">
      <h2 class="note-title">${note.title}</h2>
      <p class="note-date">${note.date}<span class="note-author"> / By ${note.author}</span></p>
      <p class="note-content">${note.noteText}</p>
    </article>`;

  NoteDetailsWrapElement.innerHTML = createdNote;
}

// Function to handle the note click event and render the note details
export function handleNoteClick (event) {
  const noteId = event.target.closest('.note').getAttribute('data-key');
  const isDeleteButtonClicked = event.target.classList.contains('delete-button');

  if (!isDeleteButtonClicked) {
    saveDataToLocalStorage('previousNoteId', noteId);
  }

  const notesList = getDataFromLocalStorage('notesList') || [];
  const previousId = getDataFromLocalStorage('previousNoteId');
  const note = getNoteById(previousId, notesList);
  renderNoteDetails(note);
}

/* eslint-disable */
// Function to handle the case when no notes are available
export function handleNoNotes () {
  NoteDetailsWrapElement.innerHTML = '<p>No details to show</p>';
  localStorage.removeItem('previousNoteId');
  saveDataToLocalStorage('id', 0);
}
/* eslint-enable */

// Function to add click event handlers to notes
export function addNoteClickHandlers (notes) {
  notes.forEach((note) => {
    note.addEventListener('click', handleNoteClick);
  });
}

// Function to handle the previous note ID
export function handlePreviousNoteId (previousNoteId, notesList) {
  if (previousNoteId && isNoteExist(previousNoteId, notesList)) {
    const previousNote = getNoteById(previousNoteId, notesList);
    renderNoteDetails(previousNote);
    return true;
  }
  return false;
}

// Function to handle default note rendering
export function handleDefaultNoteRendering (notesList) {
  if (notesList.length > 0) {
    const firstNote = notesList[0];
    renderNoteDetails(firstNote);
    saveDataToLocalStorage('previousNoteId', firstNote.id.toString());
  }
}

// Function to handle the details page view
export function handleDetailsPageView () {
  const allDomNotes = document.querySelectorAll('.notes-wrapper .note');
  if (!allDomNotes.length) {
    handleNoNotes();
    return;
  }

  addNoteClickHandlers(allDomNotes);

  const previousNoteId = getPreviousNoteId();
  const notesList = getDataFromLocalStorage('notesList') || [];

  if (handlePreviousNoteId(previousNoteId, notesList)) {
    return;
  }

  handleDefaultNoteRendering(notesList);
}

// Order Localstorge list based on index after the user darg and drop
export const updateLocalStorageWithNewOrder = () => {
  const notesArray = Array.from(document.querySelectorAll('.sidebar__bottom .notes-wrapper .note')).map(noteElement => ({
    id: noteElement.dataset.key,
    title: noteElement.querySelector('.note-title').innerText,
    noteText: noteElement.querySelector('.note-content').innerText,
    date: noteElement.querySelector('.publish-date').innerText,
    author: noteElement.querySelector('.note-author').innerText,
    isPinned: noteElement.classList.contains('pinned-note')
  }));

  saveDataToLocalStorage('notesList', notesArray);
};

export function draggableNotesHandler () {
  // Get all draggable note elements
  const draggableNotes = document.querySelectorAll('.sidebar__bottom .draggable.note');
  let draggedNote;

  draggableNotes.forEach(note => {
    note.addEventListener('dragstart', event => {
      draggedNote = event.target.closest('.draggable');
      if (draggedNote) {
        draggedNote.classList.add('drag-over');
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setData('text/plain', draggedNote.innerHTML);
      }
    });

    note.addEventListener('dragend', () => {
      if (draggedNote) {
        draggedNote.classList.remove('drag-over');
        draggedNote = null;
      }
    });

    note.addEventListener('dragover', event => {
      event.preventDefault();
      const target = event.target.closest('.draggable');
      if (draggedNote && target && draggedNote !== target) {
        const bounding = target.getBoundingClientRect();
        const containerScrollTop = target.parentNode.scrollTop; // Get the container's scroll position
        const offset = bounding.top + bounding.height / 2 - containerScrollTop; // Adjust for container's scroll position
        if (event.clientY < offset) {
          draggableNotes.forEach(n => {
            if (n === draggedNote) {
              target.parentNode.insertBefore(draggedNote, target);
            }
          });
        } else {
          draggableNotes.forEach(n => {
            if (n === draggedNote) {
              target.parentNode.insertBefore(draggedNote, target.nextSibling);
            }
          });
        }
      }
      updateLocalStorageWithNewOrder();
    });
  });
}

export function highlightFirstNote () {
  const firstNote = document.querySelector('.sidebar__bottom .notes-wrapper > .note');

  firstNote.classList.add('highlighted-note');
  setTimeout(() => {
    firstNote.classList.remove('highlighted-note');
  }, 1210);
}
