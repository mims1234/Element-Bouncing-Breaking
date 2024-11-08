let isActive = false;

function createParticles(x, y, color) {
  const particleCount = 20;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    particle.style.width = '5px';
    particle.style.height = '5px';
    particle.style.backgroundColor = color;
    particle.style.borderRadius = '50%';
    particle.style.pointerEvents = 'none';
    document.body.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2;
    const opacity = Math.random() * 0.5 + 0.5;
    const duration = Math.random() * 1000 + 500;

    particle.animate([
      { transform: 'translate(0, 0)', opacity: opacity },
      { transform: `translate(${Math.cos(angle) * speed * duration / 60}px, ${Math.sin(angle) * speed * duration / 60}px)`, opacity: 0 }
    ], {
      duration: duration,
      easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
    }).onfinish = () => particle.remove();
  }
}

function getRandomAnimation() {
  const animations = [
    'translateY(100vh) rotate(720deg) scale(0.1)',
    'translateX(100vw) rotate(-360deg) scale(0.2)',
    'translateX(-100vw) rotate(540deg) scale(0.3)',
    'translateY(-100vh) rotate(-180deg) scale(0.4)',
    'translate(50vw, 50vh) rotate(1080deg) scale(0.05)'
  ];
  return animations[Math.floor(Math.random() * animations.length)];
}

function applyBounceAndBreak(element) {
  const rect = element.getBoundingClientRect();
  const color = window.getComputedStyle(element).color;

  element.style.transition = 'all 0.5s ease-in-out';
  element.style.transform = `translateY(-${20 + Math.random() * 30}px) rotate(${Math.random() * 20 - 10}deg)`;
  
  setTimeout(() => {
    element.style.transform = 'translateY(0px) rotate(0deg)';
    
    setTimeout(() => {
      createParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, color);

      element.style.transition = `all ${1 + Math.random()}s cubic-bezier(0.25, 0.1, 0.25, 1)`;
      element.style.transform = getRandomAnimation();
      element.style.opacity = '0';
      
      setTimeout(() => {
        element.remove();
      }, 2000);
    }, 500);
  }, 500);
}

function handleClick(event) {
  if (isActive) {
    event.preventDefault();
    event.stopPropagation();
    applyBounceAndBreak(event.target);
  }
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggle') {
    isActive = !isActive;
    if (isActive) {
      document.addEventListener('click', handleClick, true);
    } else {
      document.removeEventListener('click', handleClick, true);
    }
    sendResponse({status: isActive ? 'activated' : 'deactivated'});
  }
});
