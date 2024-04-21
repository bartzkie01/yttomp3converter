function convertToMP3() {
    var youtubeUrl = document.getElementById("youtubeUrl").value;
    var resultDiv = document.getElementById("result");

    // Check if the URL is empty
    if (youtubeUrl.trim() === "") {
        resultDiv.innerHTML = "<p>Please enter a YouTube URL.</p>";
        return;
    }

    // Make a POST request to the server
    fetch('/convert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ youtubeUrl: youtubeUrl })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.blob();
    })
    .then(blob => {
        // Check if the response is an error message
        if (blob.type === 'application/json') {
            return blob.json().then(data => {
                throw new Error(data.error);
            });
        }
        
        // Create a temporary link element to trigger download
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'audio.mp3';
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => {
        resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
    });
}
