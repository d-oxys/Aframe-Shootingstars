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

const MAX_HP_BAR_WIDTH = 10; // Anda bisa mengubah ini sesuai kebutuhan

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
      let hpBarId = 'hp-bar' + event.detail.body.el.id.charAt(event.detail.body.el.id.length - 1); // asumsikan id target adalah 'target1', 'target2', dll.
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
      myScene.removeChild(hpBar); // menghapus hp-bar
      myScene.removeChild(event.detail.body.el); // menghapus target
      event.detail.target.el.removeEventListener('collide', shootCollided);
      myScene.removeChild(event.detail.target.el); // menghapus peluru
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
    // Misalnya, tombol 'm' untuk membuka/menutup menu
    isMenuOpen = !isMenuOpen;
    let menu = document.querySelector('#menu');
    menu.setAttribute('visible', isMenuOpen);
  }
};

// Add a script to rotate the entities
var sceneEl = document.querySelector('a-scene');
sceneEl.addEventListener('loaded', function () {
  setInterval(function () {
    var orbit1 = document.querySelector('#orbit1');
    var orbit2 = document.querySelector('#orbit2');
    // Repeat for other orbits

    var rotation = orbit1.getAttribute('rotation');
    rotation.y += 1;
    orbit1.setAttribute('rotation', rotation);

    rotation = orbit2.getAttribute('rotation');
    rotation.y += 1;
    orbit2.setAttribute('rotation', rotation);
    // Repeat for other orbits
  }, 100);
});
