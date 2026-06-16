document.addEventListener('DOMContentLoaded', () => {
    const refreshBtn = document.getElementById('refresh-btn');
    const exportCsvBtn = document.getElementById('export-csv-btn');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const backToTopBtn = document.getElementById('back-to-top');
    const container = document.getElementById('release-notes-container');
    const spinner = document.querySelector('.spinner');
    const btnText = document.querySelector('.btn-text');
    let currentEntries = [];

    const fetchNotes = async () => {
        // Set loading state
        refreshBtn.disabled = true;
        spinner.style.display = 'block';
        
        // Show skeleton loaders if empty
        if (container.innerHTML.trim() === '') {
            container.innerHTML = `
                <div class="loading-skeleton"></div>
                <div class="loading-skeleton"></div>
                <div class="loading-skeleton"></div>
            `;
        }

        try {
            const response = await fetch('/api/release-notes');
            const data = await response.json();

            if (data.status === 'success') {
                currentEntries = data.entries;
                renderNotes(data.entries);
            } else {
                showError('Failed to load release notes. ' + data.message);
            }
        } catch (error) {
            showError('Error connecting to the server. Please ensure the Flask app is running.');
            console.error(error);
        } finally {
            refreshBtn.disabled = false;
            spinner.style.display = 'none';
        }
    };

    const renderNotes = (entries) => {
        container.innerHTML = '';
        
        if (entries.length === 0) {
            container.innerHTML = '<p class="subtitle text-center">No release notes found.</p>';
            return;
        }

        entries.forEach(entry => {
            // Parse date
            const dateObj = new Date(entry.updated);
            const formattedDate = dateObj.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
            });

            const card = document.createElement('div');
            card.className = 'note-card';
            
            // Clean content slightly if needed, though it's HTML from the feed
            const contentDiv = document.createElement('div');
            contentDiv.innerHTML = entry.content;
            const textContent = contentDiv.textContent || contentDiv.innerText || "";
            // Create a brief excerpt for tweeting
            const excerpt = textContent.substring(0, 100).trim() + '...';

            // Tweet URL
            const tweetText = encodeURIComponent(`BigQuery Update: ${entry.title}\n\n${excerpt}\n\nRead more: ${entry.link}`);
            const tweetUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;

            card.innerHTML = `
                <div class="note-header">
                    <h2 class="note-title">${entry.title}</h2>
                    <span class="note-date">${formattedDate}</span>
                </div>
                <div class="note-content">
                    ${entry.content}
                </div>
                <div class="note-actions">
                    <button class="btn copy-btn" onclick="copyToClipboard(this, \`${encodeURIComponent(textContent.trim())}\`)">
                        Copy
                    </button>
                    <a href="${tweetUrl}" target="_blank" rel="noopener noreferrer" class="btn tweet-btn">
                        <svg style="width:16px;height:16px;margin-right:6px;fill:currentColor;vertical-align:text-bottom" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                        </svg>
                        Tweet this update
                    </a>
                </div>
            `;
            container.appendChild(card);
        });
    };

    const showError = (msg) => {
        container.innerHTML = `<div class="error-msg">${msg}</div>`;
    };

    // Global copy function
    window.copyToClipboard = async (btn, textEncoded) => {
        try {
            const text = decodeURIComponent(textEncoded);
            await navigator.clipboard.writeText(text);
            const originalText = btn.innerText;
            btn.innerText = 'Copied!';
            setTimeout(() => {
                btn.innerText = originalText;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const exportToCSV = () => {
        if (currentEntries.length === 0) return;

        // Create CSV string
        const headers = ['Title', 'Date', 'Link', 'Content Summary'];
        const csvRows = [headers.join(',')];

        currentEntries.forEach(entry => {
            const dateObj = new Date(entry.updated);
            const formattedDate = dateObj.toLocaleDateString('en-US');
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = entry.content;
            const textContent = (tempDiv.textContent || tempDiv.innerText || "").replace(/"/g, '""').trim();
            const summary = textContent.substring(0, 150) + '...';

            const row = [
                `"${entry.title.replace(/"/g, '""')}"`,
                `"${formattedDate}"`,
                `"${entry.link}"`,
                `"${summary}"`
            ];
            csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', 'bigquery_release_notes.csv');
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // Event listeners
    exportCsvBtn.addEventListener('click', exportToCSV);
    refreshBtn.addEventListener('click', fetchNotes);
    
    // Theme toggle
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const isLightMode = document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    });

    // Check for saved theme
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
    }

    // Back to top functionality
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Initial fetch
    fetchNotes();
});
