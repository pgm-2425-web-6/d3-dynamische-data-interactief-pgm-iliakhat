function updateTime() {
    const timerElement = document.querySelector('.timer');
    const now = new Date();

    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    timerElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// Update the timer every second
setInterval(updateTime, 1000);

// Call it immediately to display the time without delay
updateTime();
