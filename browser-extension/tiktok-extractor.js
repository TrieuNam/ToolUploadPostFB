// TikTok Video Link Extractor - Chrome Extension
// File: content.js

(function() {
    'use strict';
    
    // Create UI Button
    function createExtractButton() {
        // Check if already exists
        if (document.getElementById('tiktok-extractor-btn')) {
            return;
        }
        
        const button = document.createElement('button');
        button.id = 'tiktok-extractor-btn';
        button.innerHTML = '📋 Extract Videos';
        button.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            z-index: 99999;
            padding: 12px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 8px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            font-size: 14px;
        `;
        
        button.addEventListener('click', extractVideos);
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
        });
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(button);
    }
    
    // Extract video links
    function extractVideos() {
        console.log('🔍 Extracting TikTok videos...');
        
        const videos = [];
        
        // Method 1: Find video links in DOM
        const videoLinks = document.querySelectorAll('a[href*="/video/"]');
        
        videoLinks.forEach(link => {
            const href = link.href;
            if (href && href.includes('/video/') && !videos.includes(href)) {
                videos.push(href);
            }
        });
        
        // Method 2: Find from video elements
        const videoElements = document.querySelectorAll('div[data-e2e="user-post-item"]');
        videoElements.forEach(el => {
            const link = el.querySelector('a');
            if (link && link.href && !videos.includes(link.href)) {
                videos.push(link.href);
            }
        });
        
        if (videos.length === 0) {
            showMessage('⚠️ Không tìm thấy video! Vui lòng scroll xuống để load thêm video.', 'warning');
            return;
        }
        
        // Show results
        showResults(videos);
    }
    
    // Show results modal
    function showResults(videos) {
        // Remove old modal if exists
        const oldModal = document.getElementById('tiktok-extractor-modal');
        if (oldModal) {
            oldModal.remove();
        }
        
        // Create modal
        const modal = document.createElement('div');
        modal.id = 'tiktok-extractor-modal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 999999;
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
            max-width: 600px;
            max-height: 80vh;
            overflow-y: auto;
        `;
        
        // Create overlay
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 999998;
        `;
        overlay.addEventListener('click', () => {
            modal.remove();
            overlay.remove();
        });
        
        // Create content
        const html = `
            <div style="margin-bottom: 20px;">
                <h2 style="margin: 0 0 10px 0; color: #333; font-size: 24px;">
                    🎬 Tìm thấy ${videos.length} video
                </h2>
                <p style="color: #666; margin: 0;">
                    Copy danh sách hoặc tải về file JSON
                </p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <textarea id="video-list" readonly style="
                    width: 100%;
                    height: 200px;
                    padding: 10px;
                    border: 2px solid #e0e0e0;
                    border-radius: 6px;
                    font-family: monospace;
                    font-size: 12px;
                    resize: vertical;
                ">${videos.join('\n')}</textarea>
            </div>
            
            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                <button id="copy-btn" style="
                    flex: 1;
                    padding: 12px 20px;
                    background: #667eea;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-weight: bold;
                    cursor: pointer;
                    min-width: 150px;
                ">
                    📋 Copy All
                </button>
                
                <button id="download-json-btn" style="
                    flex: 1;
                    padding: 12px 20px;
                    background: #28a745;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-weight: bold;
                    cursor: pointer;
                    min-width: 150px;
                ">
                    💾 Download JSON
                </button>
                
                <button id="close-btn" style="
                    flex: 1;
                    padding: 12px 20px;
                    background: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    font-weight: bold;
                    cursor: pointer;
                    min-width: 150px;
                ">
                    ❌ Close
                </button>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 6px;">
                <p style="margin: 0; color: #1976d2; font-size: 14px;">
                    💡 <strong>Tip:</strong> Import JSON vào Excel hoặc paste trực tiếp vào Python script
                </p>
            </div>
        `;
        
        modal.innerHTML = html;
        
        // Add event listeners
        document.body.appendChild(overlay);
        document.body.appendChild(modal);
        
        document.getElementById('copy-btn').addEventListener('click', () => {
            const textarea = document.getElementById('video-list');
            textarea.select();
            document.execCommand('copy');
            showMessage('✅ Đã copy ' + videos.length + ' video links!', 'success');
        });
        
        document.getElementById('download-json-btn').addEventListener('click', () => {
            const data = {
                extracted_at: new Date().toISOString(),
                total: videos.length,
                videos: videos.map((url, idx) => ({
                    id: idx + 1,
                    url: url,
                    video_id: extractVideoId(url)
                }))
            };
            
            downloadJSON(data, `tiktok-videos-${Date.now()}.json`);
            showMessage('✅ Đã tải về JSON file!', 'success');
        });
        
        document.getElementById('close-btn').addEventListener('click', () => {
            modal.remove();
            overlay.remove();
        });
    }
    
    // Extract video ID from URL
    function extractVideoId(url) {
        try {
            if (url.includes('/video/')) {
                return url.split('/video/')[1].split('?')[0].split('/')[0];
            }
            return null;
        } catch {
            return null;
        }
    }
    
    // Download JSON
    function downloadJSON(data, filename) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    
    // Show message
    function showMessage(text, type = 'info') {
        const colors = {
            success: '#28a745',
            warning: '#ffc107',
            error: '#dc3545',
            info: '#667eea'
        };
        
        const msg = document.createElement('div');
        msg.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999999;
            padding: 15px 25px;
            background: ${colors[type] || colors.info};
            color: white;
            border-radius: 8px;
            font-weight: bold;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;
        msg.textContent = text;
        
        document.body.appendChild(msg);
        
        setTimeout(() => {
            msg.style.opacity = '0';
            msg.style.transition = 'opacity 0.3s';
            setTimeout(() => msg.remove(), 300);
        }, 3000);
    }
    
    // Auto-load more videos when scrolling
    let scrollTimer;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const clientHeight = document.documentElement.clientHeight;
            
            // If near bottom, show hint
            if (scrollHeight - scrollTop - clientHeight < 500) {
                console.log('📜 Near bottom - TikTok will load more videos automatically');
            }
        }, 200);
    });
    
    // Initialize
    function init() {
        // Only run on TikTok profile pages
        if (window.location.hostname.includes('tiktok.com')) {
            createExtractButton();
            console.log('✅ TikTok Video Extractor loaded!');
        }
    }
    
    // Run on page load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Re-run on navigation (SPA)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(init, 1000);
        }
    }).observe(document, { subtree: true, childList: true });
    
})();
