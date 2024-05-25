let countdownTimer;

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ interval: 30, remainingTime: 30 * 60, isRunning: false }, () => {
    console.log('The interval is set to 30 minutes.');
  });
});

chrome.runtime.onStartup.addListener(() => {
  chrome.storage.sync.get('isRunning', (data) => {
    if (data.isRunning) {
      startTimer();
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.command === 'updateInterval') {
    chrome.storage.sync.set({ interval: request.interval, remainingTime: request.interval * 60, isRunning: true }, () => {
      startTimer();
      sendResponse({ result: 'Interval updated and timer restarted' });
    });
    return true;
  }
});

function startTimer() {
  if (countdownTimer) {
    clearInterval(countdownTimer);
  }
  chrome.storage.sync.get('remainingTime', (data) => {
    let secondsRemaining = data.remainingTime;

    countdownTimer = setInterval(() => {
      secondsRemaining--;
      chrome.storage.sync.set({ remainingTime: secondsRemaining });

      if (secondsRemaining <= 0) {
        clearInterval(countdownTimer);
        chrome.storage.sync.set({ isRunning: false });
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'images/icon48.png',
          title: 'Break Reminder',
          message: 'You have been using the browser for your set interval. Take a break!'
        });

        // 打开popup窗口
        chrome.windows.create({
          url: chrome.runtime.getURL("popup.html"),
          type: "popup",
          width: 300,
          height: 200
        });
      }
    }, 1000);
  });
}