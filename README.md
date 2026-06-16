# BigQuery Release Notes Fetcher 🚀

A modern, responsive web application that dynamically fetches and displays the latest Google Cloud BigQuery release notes. Built with a Python Flask backend to securely proxy data and a clean vanilla HTML/CSS/JS frontend for a premium user experience.

## ✨ Features

- **Live Data Fetching**: Pulls the most up-to-date release notes directly from Google Cloud's official XML feed.
- **CORS Bypass**: Uses a Flask backend proxy to safely fetch cross-origin XML data without browser security blocks.
- **Asynchronous UI**: Includes a "Refresh" capability with loading skeletons and spinners to update content without a page reload.
- **Premium Design**: Dark-mode optimized UI with "glassmorphic" elements, Google Fonts (Inter), and hover micro-animations.
- **Social Sharing**: One-click "Tweet this update" integration dynamically generates Twitter drafts for individual release notes.

## 🛠️ Technology Stack

- **Backend**: Python 3, Flask, `requests`, `xml.etree.ElementTree`
- **Frontend**: HTML5, CSS3 (Vanilla), JavaScript (Vanilla)

## 📁 Project Structure

```text
bq-release-notes/
├── app.py                  # Flask backend server & XML parser
├── requirements.txt        # Python dependencies
├── .gitignore              # Git ignore file
├── templates/
│   └── index.html          # Main HTML structure
└── static/
    ├── style.css           # Premium UI styling & animations
    └── script.js           # Frontend logic, fetch API, and DOM manipulation
```

## 🚀 Getting Started

Follow these instructions to run the project on your local machine.

### Prerequisites

- Python 3.x installed on your system.

### Installation & Setup

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/Aashika25/Aashika-GCP-my-app.git
   cd Aashika-GCP-my-app
   ```

2. **(Optional but Recommended) Create a Virtual Environment**:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

3. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the Application**:
   ```bash
   python app.py
   ```

5. **View in Browser**:
   Open your web browser and navigate to:
   [http://127.0.0.1:5000](http://127.0.0.1:5000)

## 🤝 Contributing

Feel free to fork this project, submit pull requests, or open issues to suggest new features or report bugs!
