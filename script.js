// DOM Elements
const feedbackList = document.getElementById('feedbackList');
const feedbackInput = document.getElementById('feedbackInput');
const submitFeedback = document.getElementById('submitFeedback');
const studentNameInput = document.getElementById('studentName');
const tagSelect = document.getElementById('tagSelect');

// Backend URL (Update this with your Vercel deployment URL)
const BACKEND_URL = 'https://codehs-feedback.vercel.app/api/feedback';

// Load feedback from the backend
async function loadFeedback() {
    try {
        const response = await fetch(BACKEND_URL, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
            mode: 'cors'
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const feedbacks = await response.json();
        feedbackList.innerHTML = ''; // Clear existing feedback

        feedbacks.forEach(({ studentName, text, timestamp, tag }) => {
            const feedbackCard = document.createElement('div');
            feedbackCard.classList.add('feedback-card');
            
            const date = new Date(timestamp).toLocaleString();
            
            feedbackCard.innerHTML = `
                <div class="card-header">
                    <span class="student-name">${studentName}</span>
                    <span class="tag ${tag}">${tag}</span>
                </div>
                <p class="feedback-text">${text}</p>
                <div class="card-footer">
                    <span class="timestamp">${date}</span>
                </div>
            `;
            
            feedbackList.appendChild(feedbackCard);
        });
    } catch (error) {
        console.error('Error loading feedback:', error);
        feedbackList.innerHTML = '<p class="error">Failed to load feedback. Please try again later.</p>';
    }
}

// Submit feedback handler
async function handleSubmit() {
    const feedbackText = feedbackInput.value.trim();
    const studentName = studentNameInput.value.trim();
    const tag = tagSelect.value;

    if (!feedbackText) {
        alert('Please enter feedback text.');
        return;
    }

    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify({ 
                text: feedbackText, 
                studentName: studentName || 'Anonymous',
                tag: tag
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to submit feedback');
        }

        // Clear inputs after successful submission
        feedbackInput.value = '';
        studentNameInput.value = '';
        tagSelect.value = 'feedback';

        // Reload feedback to show new submission
        await loadFeedback();
    } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('Failed to submit feedback. Please try again.');
    }
}

// Event Listeners
submitFeedback.addEventListener('click', handleSubmit);

feedbackInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        handleSubmit();
    }
});

// Load feedback on page load
document.addEventListener('DOMContentLoaded', loadFeedback);
