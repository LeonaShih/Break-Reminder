document.addEventListener('DOMContentLoaded', () => {
    const intervalInput = document.getElementById('interval');
    const saveButton = document.getElementById('save');
    const countdownElement = document.getElementById('countdown');
    let countdownTimer;
  
    chrome.storage.sync.get(['interval', 'remainingTime', 'isRunning'], (data) => {
      intervalInput.value = data.interval;
      if (data.isRunning) {
        startCountdown(data.remainingTime);
      } else {
        countdownElement.textContent = "My darling, it's time to take a break!";
      }
    });
  
    saveButton.addEventListener('click', () => {
      const interval = parseInt(intervalInput.value, 10);
      if (!isNaN(interval) && interval > 0) {
        chrome.runtime.sendMessage({ command: 'updateInterval', interval: interval }, (response) => {
          console.log(response.result);
          startCountdown(interval * 60);
        });
      }
    });
  
    function startCountdown(secondsRemaining) {
      if (countdownTimer) {
        clearInterval(countdownTimer);
      }
      updateCountdownDisplay(secondsRemaining);
  
      countdownTimer = setInterval(() => {
        secondsRemaining--;
        if (secondsRemaining <= 0) {
          clearInterval(countdownTimer);
          countdownElement.textContent = "My darling, it's time to take a break!";
        } else {
          updateCountdownDisplay(secondsRemaining);
        }
      }, 1000);
    }
  
    function updateCountdownDisplay(seconds) {
      const minutes = Math.floor(seconds / 60);
      const secondsDisplay = seconds % 60;
      countdownElement.textContent = `${minutes}:${secondsDisplay < 10 ? '0' : ''}${secondsDisplay}`;
    }
  });