// Array of gradient colors (you can add more!)
const GRADIENTS = [
  'gradient-1',
  'gradient-2',
  'gradient-3',
  'gradient-4',
  'gradient-5',
  'gradient-6',
  'gradient-7',
  'gradient-8'
];

// Function to get a random gradient
function getRandomGradient() {
  return GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];
}

// Function to extract Google Drive file ID from a shareable link
function extractFileId(driveLink) {
  if (!driveLink) return null;
  const match = driveLink.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

// Function to create embed URL for videos (preview mode)
function createVideoEmbedUrl(fileId) {
  return `https://drive.google.com/file/d/${fileId}/preview`;
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
    
    // Loop through rows (skip header at i = 0)
    for (let i = 1; i < rows.length; i++) {
      const columns = rows[i].split(',').map(cell => cell.trim());
      const studentName = columns[0];
      const videoLink = columns[1];
      
      // Only create card if student name and video link exist
      if (studentName && videoLink) {
        const videoFileId = extractFileId(videoLink);
        
        if (videoFileId) {
          // Create the card
          const card = document.createElement('div');
          card.className = 'video-card';
          
          // Add random gradient
          const randomGradient = getRandomGradient();
          card.classList.add(randomGradient);
          
          const videoEmbedUrl = createVideoEmbedUrl(videoFileId);
          
          // Just show student name (no image)
          card.innerHTML = `
            <div class="student-name">${studentName}</div>
          `;
          
          // When clicked, play the video
          card.addEventListener('click', () => playVideo(videoEmbedUrl, studentName));
          
          // Add card to grid
          grid.appendChild(card);
        }
      }
    }
  } catch (error) {
    console.error('Error loading videos:', error);
    document.getElementById('videoGrid').innerHTML = '<p style="text-align: center; color: red;">Error loading videos. Check console.</p>';
  }
}

// Open modal and play video
function playVideo(embedUrl, studentName) {
  let modal = document.getElementById('videoModal');
  
  // Create modal if it doesn't exist yet
  if (!modal) {
    modal = createModal();
  }
  
  const iframe = modal.querySelector('iframe');
  const title = modal.querySelector('.modal-title');
  
  iframe.src = embedUrl;
  title.textContent = studentName;
  modal.classList.add('active');
}

// Create the modal popup for video playback
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
  
  // Close button
  modal.querySelector('.close').addEventListener('click', () => {
    modal.classList.remove('active');
    modal.querySelector('iframe').src = '';
  });
  
  // Close when clicking outside the modal
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
      modal.querySelector('iframe').src = '';
    }
  });
  
  return modal;
}

// Start loading videos when page loads
document.addEventListener('DOMContentLoaded', loadVideos);
