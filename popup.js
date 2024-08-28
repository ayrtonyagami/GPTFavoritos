document.getElementById('saveLink').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;
    const title = tabs[0].title;
    saveFavorite(url, title);
  });
});

document.getElementById('exportLinks').addEventListener('click', exportFavorites);
document.getElementById('importLinks').addEventListener('change', importFavorites);

function saveFavorite(url, title) {
  chrome.storage.local.get({ favorites: [] }, (result) => {
    const favorites = result.favorites;
    favorites.push({ url, title });
    chrome.storage.local.set({ favorites }, () => {
      displayFavorites();
    });
  });
}

function displayFavorites() {
  chrome.storage.local.get({ favorites: [] }, (result) => {
    const favoritesList = document.getElementById('favoritesList');
    favoritesList.innerHTML = '';
    result.favorites.forEach((fav, index) => {
      const listItem = document.createElement('li');
      const link = document.createElement('a');
      link.href = fav.url;
      link.textContent = fav.title;
      link.target = '_blank';
      listItem.appendChild(link);

      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.className = 'remove-btn';
      removeButton.addEventListener('click', () => {
        removeFavorite(index);
      });
      listItem.appendChild(removeButton);

      favoritesList.appendChild(listItem);
    });
  });
}

function removeFavorite(index) {
  chrome.storage.local.get({ favorites: [] }, (result) => {
    const favorites = result.favorites;
    favorites.splice(index, 1);
    chrome.storage.local.set({ favorites }, () => {
      displayFavorites();
    });
  });
}

function exportFavorites() {
  chrome.storage.local.get({ favorites: [] }, (result) => {
    const data = JSON.stringify(result.favorites, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'favorites.json';
    a.click();
    URL.revokeObjectURL(url);
  });
}

function importFavorites(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const importedData = JSON.parse(e.target.result);
      chrome.storage.local.get({ favorites: [] }, (result) => {
        const favorites = result.favorites.concat(importedData);
        chrome.storage.local.set({ favorites }, () => {
          displayFavorites();
        });
      });
    };
    reader.readAsText(file);
  }
}

document.addEventListener('DOMContentLoaded', displayFavorites);
