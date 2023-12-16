// Получаем доступ к видеопотоку с камеры
navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => {
  const video = document.getElementById('cameraFeed');
  video.srcObject = stream;
})
.catch(error => {
  console.error('Ошибка при получении доступа к камере:', error);
});
