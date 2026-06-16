from flask import Flask, render_template, jsonify
import requests
import xml.etree.ElementTree as ET

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/release-notes')
def get_release_notes():
    try:
        response = requests.get('https://docs.cloud.google.com/feeds/bigquery-release-notes.xml')
        response.raise_for_status()
        
        # Parse XML
        root = ET.fromstring(response.content)
        
        # Atom feed namespaces
        ns = {'atom': 'http://www.w3.org/2005/Atom'}
        
        entries = []
        for entry in root.findall('atom:entry', ns):
            title = entry.find('atom:title', ns).text if entry.find('atom:title', ns) is not None else 'No Title'
            link = entry.find('atom:link', ns).attrib.get('href') if entry.find('atom:link', ns) is not None else ''
            updated = entry.find('atom:updated', ns).text if entry.find('atom:updated', ns) is not None else ''
            content = entry.find('atom:content', ns).text if entry.find('atom:content', ns) is not None else ''
            
            entries.append({
                'title': title,
                'link': link,
                'updated': updated,
                'content': content
            })
            
        return jsonify({'status': 'success', 'entries': entries})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
