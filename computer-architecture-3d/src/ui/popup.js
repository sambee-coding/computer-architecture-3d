import { componentInfo } from './content.js';

export function createPopup() {
  const popup = document.createElement('div');
  popup.id = 'info-popup';
  popup.style.display = 'none';
  
  popup.innerHTML = `
    <div class="popup-content">
      <button id="close-popup">&times;</button>
      <h2 id="popup-title"></h2>
      <p id="popup-description"></p>
    </div>
  `;
  
  document.body.appendChild(popup);

  const closeBtn = document.getElementById('close-popup');
  closeBtn.onclick = () => popup.style.display = 'none';

  return {
    show: (id) => {
      const info = componentInfo[id];
      if (info) {
        document.getElementById('popup-title').textContent = info.title;
        document.getElementById('popup-description').textContent = info.description;
        popup.style.display = 'flex';
      }
    },
    hide: () => {
      popup.style.display = 'none';
    }
  };
}
