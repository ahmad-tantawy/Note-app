import {
  noteAuthorInput,
  noteTextInput,
  noteTitleInput,
  confirmationMessage, notesPage, addPage, addPageButton
  , notesPageButton
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
        <article class="note ${isPinnedClass}" data-key="${note.id}">
          <h3 class="note-title">${note.title}</h3>
          <p class="note-content">
            ${note.noteText}
          </p>
          <div class="note-footer">
            <p class="publish-date">${note.date}</p>
            <button class="delete-button">Delete</button>
          </div>
       </article>
      `;
    }
  });

  const notesWrapper = document.querySelector(containerSelector);
  notesWrapper.innerHTML = notes;
}
