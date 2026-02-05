// Function to extract Google Drive file ID
function extractFileId(driveLink) {
  const match = driveLink.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

// Function to create embed URL for videos
function createVideoEmbedUrl(fileId) {
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

// Function to create proxy URL for images
function createImageProxyUrl(fileId) {
  return `/.netlify/functions/proxy?id=${fileId}`;
}

// Load videos from Google Sheet
async function loadVideos() {
  const SHEET_ID = "1_3gm4OErhmYcB_ei_FItooKtmiBEre4tTfpXN9AMkZ4";
  const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
  
  try {
    const response = await fetch(csvUrl);
    const csv = await response.text();
    const rows = csv.split('\n').filter(row => row.trim() !== '');
    
    const grid = document.getElementById('videoGrid');
    grid.innerHTML = '';
    
    // Skip header row (i = 1)
    for (let i = 1; i < rows.length; i++) {
      const columns = rows[i].split(',').map(cell => cell.trim());
      const studentName = columns[0];
      const videoLink = columns[1];
      const imageLink = columns[2];
      
      if (studentName && videoLink) {
        const videoFileId = extractFileId(videoLink);
        const imageFileId = extractFileId(imageLink);
        
        if (videoFileId) {
          const card = document.createElement('div');
          card.className = 'video-card';
          
          const imageUrl = imageFileId ? createImageProxyUrl(imageFileId) : 'https://via.placeholder.com/300x200?text=No+Image';
          const videoEmbedUrl = createVideoEmbedUrl(videoFileId);
          
          card.innerHTML = `
            <img src="${imageUrl}" alt="${studentName}">
            <div class="student-name">${studentName}</div>
          `;
          
          card.addEventListener('click', () => playVideo(videoEmbedUrl, studentName));
          grid.appendChild(card);
        }
      }
    }
  } catch (error) {
    console.error('Error loading videos:', error);
    document.getElementById('videoGrid').innerHTML = '<p style="text-align: center; color: red;">Error loading videos. Check console.</p>';
  }
}

// Play video in modal
function playVideo(embedUrl, studentName) {
  const modal = document.getElementById('videoModal') || createModal();
  const iframe = modal.querySelector('iframe');
  const title = modal.querySelector('.modal-title');
  
  iframe.src = embedUrl;
  title.textContent = studentName;
  modal.classList.add('active');
}

// Create modal if it doesn't exist
function createModal() {
  const modal = document.createElement('div');
  modal.id = 'videoModal';
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close">&times;</span>
      <iframe allowfullscreen=""></iframe>
      <div class="modal-title"></div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  modal.querySelector('.close').addEventListener('click', () => {
    modal.classList.remove('active');
    modal.querySelector('iframe').src = '';
  });
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      modal.querySelector('iframe').src = '';
    }
  });
  
  return modal;
}

// Load on page load
document.addEventListener('DOMContentLoaded', loadVideos);
