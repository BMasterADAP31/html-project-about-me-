// Joke Generator using JokeAPI
// API: https://v2.jokeapi.dev/

const getJokeBtn = document.getElementById('get-joke-btn');
const shareBtn = document.getElementById('share-btn');
const jokeText = document.getElementById('joke-text');
const jokeType = document.getElementById('joke-type');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const jokeCounter = document.getElementById('count');

let currentJoke = '';
let jokeCount = 0;

// API endpoints
const JOKE_API = 'https://v2.jokeapi.dev/joke/Any?format=json';

// Fetch a random joke from the API
async function fetchJoke() {
    try {
        // Show loading state
        loading.classList.add('active');
        errorMessage.classList.remove('active');
        getJokeBtn.disabled = true;
        shareBtn.disabled = true;

        // Fetch from API
        const response = await fetch(JOKE_API);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Check if API returned an error
        if (data.error) {
            throw new Error('Failed to fetch joke');
        }

        // Handle different joke formats
        if (data.type === 'twopart') {
            currentJoke = `${data.setup}\n\n${data.delivery}`;
        } else {
            currentJoke = data.joke;
        }

        // Display the joke
        jokeText.textContent = currentJoke;
        jokeType.textContent = `Category: ${data.category} | Type: ${data.type}`;

        // Increment counter
        jokeCount++;
        jokeCounter.textContent = jokeCount;

        // Enable share button
        shareBtn.disabled = false;

    } catch (error) {
        console.error('Error:', error);
        jokeText.textContent = 'Oops! Could not fetch a joke. Please try again.';
        jokeType.textContent = '';
        errorMessage.textContent = `Error: ${error.message}`;
        errorMessage.classList.add('active');
        shareBtn.disabled = true;

    } finally {
        // Hide loading state
        loading.classList.remove('active');
        getJokeBtn.disabled = false;
    }
}

// Share joke functionality
function shareJoke() {
    if (!currentJoke) return;

    // Create share text
    const shareText = `😂 Check out this joke: "${currentJoke}"`;

    // Try to use Web Share API if available
    if (navigator.share) {
        navigator.share({
            title: 'Random Joke',
            text: shareText
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            showNotification('Joke copied to clipboard!');
        }).catch(err => {
            console.error('Error copying to clipboard:', err);
            alert('Could not copy joke to clipboard');
        });
    }
}

// Show temporary notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #667eea;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Event listeners
getJokeBtn.addEventListener('click', fetchJoke);
shareBtn.addEventListener('click', shareJoke);

// Load a joke on page load
window.addEventListener('load', () => {
    fetchJoke();
});