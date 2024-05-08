require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs' } });

let editor;  // Global editor instance

require(['vs/editor/editor.main'], function () {
    editor = monaco.editor.create(document.getElementById('codeEditor'), {
        value: [
            '#include <stdio.h>',  // Default C code
            'int main() {',
            '    printf("Hello, World! from C\\n");',
            '    return 0;',
            '}'
        ].join('\n'),
        language: 'c',
        theme: 'vs-dark'
    });

    document.getElementById('languageSelector').addEventListener('change', updateEditor);

    document.getElementById('downloadButton').addEventListener('click', downloadCode);
    document.getElementById('copyButton').addEventListener('click', copyCodeToClipboard);
});


function updateEditor(event) {
    const languageMap = {
        'C': 'c',
        'Java': 'java',
        'Python': 'python'
    };
    const newLanguage = languageMap[event.target.value];
    monaco.editor.setModelLanguage(editor.getModel(), newLanguage);

    const defaultCodeSnippets = {
        'C': [
            '#include <stdio.h>',
            'int main() {',
            '    printf("Hello, World! from C\\n");',
            '    return 0;',
            '}'
        ].join('\n'),
        'Java': [
            'public class Main {',
            '    public static void main(String[] args) {',
            '        System.out.println("Hello, World! from Java");',
            '    }',
            '}'
        ].join('\n'),
        'Python': [
            'print("Hello, World! from Python")'
        ].join('\n')
    };
    editor.setValue(defaultCodeSnippets[event.target.value]);

    document.getElementById('outputArea').innerText = 'Output will be displayed here...';
}



function compileCode() {
    const languageSelector = document.getElementById('languageSelector');
    const outputArea = document.getElementById('outputArea');
    const language = languageSelector.value;
    const code = editor.getValue();  // Get code from Monaco Editor

    // URL mapping for different languages
    const apiUrlMap = {
        'Python': 'http://127.0.0.1:5000/compile',
        'Java': 'http://127.0.0.1:5001/compile',
        'C': 'http://127.0.0.1:5002/compile'
    };

    const apiUrl = apiUrlMap[language];

    // Making a POST request to the server asynchronously using a Promise
    const compileRequest = fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: code, language: language })
    })
        .then(response => response.json());

    // Handling the response asynchronously
    compileRequest.then(data => {
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

function downloadCode() {
    const code = editor.getValue();
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function copyCodeToClipboard() {
    const code = editor.getValue();
    navigator.clipboard.writeText(code).then(() => {
        alert('Code copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const resizer = document.getElementById('resizer');
    const outputArea = document.getElementById('outputArea');
    let startY, startHeight;

    resizer.addEventListener('mousedown', function (e) {
        startY = e.clientY;
        startHeight = parseInt(document.defaultView.getComputedStyle(outputArea).height, 10);
        document.documentElement.addEventListener('mousemove', doDrag, false);
        document.documentElement.addEventListener('mouseup', stopDrag, false);
    });

    function doDrag(e) {
        outputArea.style.height = (startHeight + e.clientY - startY) + 'px';
    }

    function stopDrag(e) {
        document.documentElement.removeEventListener('mousemove', doDrag, false);
        document.documentElement.removeEventListener('mouseup', stopDrag, false);
    }
});

