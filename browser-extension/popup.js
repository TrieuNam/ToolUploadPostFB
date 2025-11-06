// Popup script for Chrome extension

document.getElementById('extract-btn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url.includes('tiktok.com')) {
        alert('⚠️ Vui lòng mở TikTok profile trước!');
        return;
    }
    
    // Inject and execute the extractor
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: extractVideosFromPage
    });
    
    // Close popup
    window.close();
});

function extractVideosFromPage() {
    // This function runs in the context of the webpage
    const event = new CustomEvent('tiktok-extract-videos');
    document.dispatchEvent(event);
}
