function compileCode() {
    const languageSelector = document.getElementById('languageSelector');
    const codeEditor = document.getElementById('codeEditor');
    const outputArea = document.getElementById('outputArea');
    const language = languageSelector.value;
    const code = codeEditor.value;

    // URL mapping for different languages, adjust accordingly if backend URLs differ
    const apiUrlMap = {
        'Python': 'http://127.0.0.1:5000/compile',
        'Java': 'http://127.0.0.1:5001/compile',
        'C': 'http://127.0.0.1:5002/compile'
    };

    const apiUrl = apiUrlMap[language];

    // Making a POST request to the server
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code, language: language })
    })
        .then(response => response.json())
        .then(data => {
            if (data.output) {
                outputArea.innerText = 'Output: ' + data.output;
            } else if (data.error) {
                outputArea.innerText = 'Error: ' + data.error;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            outputArea.innerText = 'Error connecting to the server';
        });
}
