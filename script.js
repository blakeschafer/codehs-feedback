const feedbackList = document.getElementById('feedbackList');
const feedbackInput = document.getElementById('feedbackInput');
const submitFeedback = document.getElementById('submitFeedback');

// Backend URL (Replace with your actual deployed backend URL)
const BACKEND_URL = 'https://codehs-feedback.vercel.app/api/feedback';

// Load feedback from the backend
async function loadFeedback() {
  try {
    const response = await fetch(BACKEND_URL); // Use the correct API route
    if (!response.ok) {
      throw new Error('Failed to fetch feedback');
    }

    const feedbacks = await response.json();
    feedbackList.innerHTML = ''; // Clear the list first

    feedbacks.forEach(({ studentName, text }) => {
      const feedbackCard = document.createElement('div');
      feedbackCard.classList.add('feedback-card');
      feedbackCard.innerHTML = `
        <h3>${studentName}</h3>
        <p>${text}</p>
      `;
      feedbackList.appendChild(feedbackCard);
    });
  } catch (error) {
    console.error('Error loading feedback:', error);
  }
}

// Submit feedback to the backend
submitFeedback.addEventListener('click', async () => {
  const feedbackText = feedbackInput.value.trim();
  if (!feedbackText) {
    alert('Please enter feedback.');
    return;
  }

  try {
    const response = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: feedbackText, studentName: 'Anonymous' }),
    });

    if (!response.ok) {
      throw new Error('Failed to submit feedback');
    }

    feedbackInput.value = ''; // Clear input field
    loadFeedback(); // Reload feedback after submission
  } catch (error) {
    console.error('Error submitting feedback:', error);
  }
});

// Load feedback on page load
loadFeedback();
