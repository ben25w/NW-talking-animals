// Function to convert Google Drive link to playable format
function convertGoogleDriveLink(link) {
  const match = link.match(/\/d\/([a-zA-Z0-9-_]+)/);
  if (match) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }
  return link; // Return original if not a Drive link
}

// Function to fetch data from Google Sheet
async function loadVideos() {
  const SHEET_ID = "1_3gm4OErhmYcB_ei_FItooKtmiBEre4tTfpXN9AMkZ4";
  const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;
  
  try {
    const response = await fetch(csvUrl);
    const csv = await response.text();
    const rows = csv.split('\n').filter(row => row.trim() !== '');
    
    const grid = document.getElementById('videoGrid');
    grid.innerHTML = ''; // Clear existing content
    
    // Skip header row (i = 1)
    for (let i = 1; i < rows.length; i++) {
      const [studentName, videoLink] = rows[i].split(',').map(cell => cell.trim());
      
      if (studentName && videoLink) {
        // Convert Google Drive link to playable format
        const playableLink = convertGoogleDriveLink(videoLink);
        
        // Create video card
        const card = document.createElement('div');
        card.className = 'video-card';
        
        card.innerHTML = `
          <video controls>
            <source src="${playableLink}" type="video/mp4">
            Your browser doesn't support HTML5 video.
          </video>
          <div class="student-name">${studentName}</div>
        `;
        
        grid.appendChild(card);
      }
    }
  } catch (error) {
    console.error('Error loading videos:', error);
    document.getElementById('videoGrid').innerHTML = '<p>Error loading videos. Check console.</p>';
  }
}

// Load videos when page loads
document.addEventListener('DOMContentLoaded', loadVideos);
