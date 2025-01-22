const feedbackList = document.getElementById('feedbackList');
const feedbackInput = document.getElementById('feedbackInput');
const submitFeedback = document.getElementById('submitFeedback');

// Backend URL (replace with your deployed backend URL later)
const BACKEND_URL = 'https://your-backend.vercel.app';

// Load feedback from backend
async function loadFeedback() {
  const response = await fetch(`${BACKEND_URL}/feedback`);
  const feedbacks = await response.json();
  feedbackList.innerHTML = ''; // Clear the list first
  feedbacks.forEach(({ studentName, text }) => {
    addFeedbackToDOM(studentName, text);
  });
}

// Add feedback to DOM
function addFeedbackToDOM(studentName, text) {
  const feedbackCard = document.createElement('div');
  feedbackCard.classList.add('feedback-card');
  feedbackCard.innerHTML = `
    <h3>${studentName}</h3>
    <p>${text}</p>
  `;
  feedbackList.appendChild(feedbackCard);
}

// Submit new feedback
submitFeedback.addEventListener('click', async () => {
  const feedbackText = feedbackInput.value.trim();
  if (!feedbackText) {
    alert('Please enter feedback.');
    return;
  }

  await fetch(`${BACKEND_URL}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ studentName: 'Anonymous', text: feedbackText })
  });

  feedbackInput.value = '';
  loadFeedback(); // Reload feedback after submission
});

// Load feedback on page load
loadFeedback();
