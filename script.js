function reportTranscript(transcriptText) {
    document.getElementById('transcript').textContent = transcriptText;
}

async function uploadAudio(blob) {
    let formData = new FormData();
    formData.append("audio", blob, "recording.wav");
  
    const response = await fetch('http://localhost:8000/transcribe-audio/', {
      method: 'POST',
      body: formData,
    });
  
    if (response.ok) {
      const data = await response.json();
      reportTranscript(data["transcript"]);
      return data;
    } else {
      console.error("Error from server:", await response.text());
      return null;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const recorder = new WavRecorder();

    document.getElementById('startRecordButton').addEventListener('click', async () => {
        console.log("startRecordButton clicked");
        const started = await recorder.start();
        if (started) {
            document.getElementById('stopRecordButton').disabled = false;
            document.getElementById('startRecordButton').disabled = true;
            console.log("Recording started");
        } else {
            console.log("Failed to start recording");
        }
    });

    document.getElementById('stopRecordButton').addEventListener('click', () => {
        console.log("stopRecordButton clicked");
        recorder.stop();
        document.getElementById('stopRecordButton').disabled = true;
        document.getElementById('startRecordButton').disabled = false;
        document.getElementById('downloadButton').disabled = false;
        document.getElementById('transcribeButton').disabled = false;
        console.log("Recording stopped");
    });

    document.getElementById('downloadButton').addEventListener('click', () => {
        console.log("downloadButton clicked");
        recorder.download('recording.wav');
        console.log("Download initiated");
    });

    document.getElementById('transcribeButton').addEventListener('click', async () => {
        console.log("transcribeButton clicked");
        const audioBlob = await recorder.getBlob();
        if (audioBlob) {
            await uploadAudio(audioBlob);
            console.log("Transcription initiated");
        } else {
            console.error("No audio data available for transcription");
        }
    });
});
