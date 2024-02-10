let nextLevel = 'index.html';
let isMenuOpen = false;

const shoot = () => {
  const bullet = document.createElement('a-sphere');
  let pos = myCamera.getAttribute('position');
  bullet.setAttribute('position', pos);
  bullet.setAttribute('color', 'red');
  bullet.setAttribute('velocity', getDirection(myCamera, 30));
  bullet.setAttribute('dynamic-body', true);
  bullet.setAttribute('radius', 0.5);
  bullet.setAttribute('body', 'type: dynamic');
  bullet.setAttribute('src', 'https://i.imgur.com/H8e3Vnu.png');
  myScene.appendChild(bullet);
  bullet.addEventListener('collide', shootCollided);
};

const teleport = () => {
  console.log('Pressing teleport...');
  const bullet = document.createElement('a-torus');
  let pos = myCamera.getAttribute('position');
  bullet.setAttribute('position', pos);
  bullet.setAttribute('velocity', getDirection(myCamera, 30));
  bullet.setAttribute('dynamic-body', true);
  bullet.setAttribute('radius', 0.5);
  bullet.setAttribute('arc', 360);
  bullet.setAttribute('radius-tubular', 0.1);
  bullet.setAttribute('rotation', { x: 90, y: 0, z: 0 });
  bullet.setAttribute('src', 'https://i.imgur.com/H8e3Vnu.png');
  myScene.appendChild(bullet);
  bullet.addEventListener('collide', teleportCollided);
};

const MAX_HP_BAR_WIDTH = 10;

const shootCollided = (event) => {
  if (event.detail.body.el.id === 'floor') {
    console.log('Hit the floor');
    event.detail.target.el.removeEventListener('collide', shootCollided);
    myScene.removeChild(event.detail.target.el);
  } else if (event.detail.body.el.className.includes('target')) {
    console.log('Hit the target!');
    let hitPoints = parseInt(event.detail.body.el.getAttribute('hit-points'));
    let initialHitPoints = parseInt(event.detail.body.el.getAttribute('initial-hit-points'));
    hitPoints--;
    if (hitPoints > 0) {
      event.detail.body.el.setAttribute('hit-points', hitPoints);
      let hpBarId = 'hp-bar' + event.detail.body.el.id.charAt(event.detail.body.el.id.length - 1);
      let hpBar = document.getElementById(hpBarId);
      let hpBarWidth = Math.min((hitPoints / initialHitPoints) * MAX_HP_BAR_WIDTH, MAX_HP_BAR_WIDTH);
      hpBar.setAttribute('width', hpBarWidth);
      let percentage = (hitPoints / initialHitPoints) * 100;
      if (percentage <= 50 && percentage > 20) {
        hpBar.setAttribute('color', 'yellow');
      } else if (percentage <= 20) {
        hpBar.setAttribute('color', 'red');
      }
    } else {
      let hpBarId = 'hp-bar' + event.detail.body.el.id.charAt(event.detail.body.el.id.length - 1);
      let hpBar = document.getElementById(hpBarId);
      myScene.removeChild(hpBar);
      myScene.removeChild(event.detail.body.el);
      event.detail.target.el.removeEventListener('collide', shootCollided);
      myScene.removeChild(event.detail.target.el);
    }
    if (document.querySelectorAll('.target').length === 0) {
      console.log('You win!');
      location.href = nextLevel;
    }
  }
};

const teleportCollided = (event) => {
  if (event.detail.body.el.id === 'floor') {
    console.log('Hit the floor');
    event.detail.target.el.removeEventListener('collide', teleportCollided);
    let pos = event.detail.target.el.getAttribute('position');
    myScene.removeChild(event.detail.target.el);
    myCamera.setAttribute('position', { x: pos.x, y: 2, z: pos.z });
  }
};

document.onkeydown = (event) => {
  if (event.which == 32) {
    shoot();
  } else if (event.which == 67) {
    teleport();
  } else if (event.which == 77) {
    isMenuOpen = !isMenuOpen;
    let menu = document.querySelector('#menu');
    menu.setAttribute('visible', isMenuOpen);
  }
};

// Fungsi untuk membuat portal
const createPortal = () => {
  const portal = document.createElement('a-cylinder');
  portal.setAttribute('position', '2.5 0 -15');
  portal.setAttribute('radius', '4');
  portal.setAttribute('height', '10');
  portal.setAttribute('color', 'blue');
  portal.setAttribute('opacity', '0.5');
  portal.setAttribute('open-ended', 'true');
  myScene.appendChild(portal);

  portal.addEventListener('click', () => {
    let isConfirmed = confirm('Apakah kamu bersedia berpindah ke dunia AR?');
    if (isConfirmed) {
      window.location.href = 'ar.html';
    }
  });
};
createPortal();

// Fungsi untuk memindai barcode
const scanBarcode = () => {
  let video = document.createElement('video');
  let canvasElement = document.createElement('canvas');
  let canvas = canvasElement.getContext('2d');
  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then((stream) => {
    video.srcObject = stream;
    video.setAttribute('playsinline', true);
    video.play();
    requestAnimationFrame(tick);
  });

  const tick = () => {
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvasElement.height = video.videoHeight;
      canvasElement.width = video.videoWidth;
      canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
      let imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
      let code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });
      if (code) {
        console.log('Barcode detected:', code.data);
        // Tambahkan barcode yang disediakan sebelumnya di sini
        let providedBarcode = '1234567890';
        if (code.data === providedBarcode) {
          console.log('Correct barcode scanned, moving to the next level...');
          window.location.href = 'level4.html';
        } else {
          alert('Barcode yang dipindai tidak sesuai. Silakan coba lagi.');
        }
      }
    }
    requestAnimationFrame(tick);
  };
};

// Panggil fungsi scanBarcode saat game dimulai
scanBarcode();

document.addEventListener('keydown', (event) => {
  if (event.key === 'a' || event.key === 'A') {
    scanBarcode();
  }
});
