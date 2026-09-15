const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const mobileNav = document.querySelector('.mobile-nav');
const chatForm = document.querySelector('#chat-form');
const chatInput = document.querySelector('#chat-input');
const chatMessages = document.querySelector('#chat-messages');

const replies = [
  '좋아요. 핵심 목표부터 정리한 뒤 바로 실행할 수 있는 단계로 나눠볼게요.',
  '말씀하신 내용을 이해했어요. 중요한 포인트를 세 가지로 정리해 드릴까요?',
  '물론이죠. 먼저 초안을 만들고, 원하시는 말투에 맞춰 다듬어 드릴게요.',
];

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 16);
}, { passive: true });

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? '메뉴 열기' : '메뉴 닫기');
  mobileNav.hidden = isOpen;
});

mobileNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileNav.hidden = true;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', '메뉴 열기');
  });
});

function addMessage(text, role) {
  const wrapper = document.createElement('div');
  wrapper.className = `message ${role === 'user' ? 'user-message' : 'dan-message'}`;
  if (role === 'dan') {
    const avatar = document.createElement('span');
    avatar.className = 'mini-avatar';
    avatar.setAttribute('aria-hidden', 'true');
    avatar.textContent = 'D';
    wrapper.appendChild(avatar);
  }
  const bubble = document.createElement('p');
  bubble.textContent = text;
  wrapper.appendChild(bubble);
  chatMessages.appendChild(wrapper);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function submitPrompt(prompt) {
  const text = prompt.trim();
  if (!text) return;
  addMessage(text, 'user');
  chatInput.value = '';

  const typing = document.createElement('div');
  typing.className = 'message dan-message typing';
  typing.innerHTML = '<span class="mini-avatar" aria-hidden="true">D</span><p><i></i><i></i><i></i></p>';
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  window.setTimeout(() => {
    typing.remove();
    const reply = replies[Math.floor(Math.random() * replies.length)];
    addMessage(reply, 'dan');
  }, 850);
}

chatForm.addEventListener('submit', (event) => {
  event.preventDefault();
  submitPrompt(chatInput.value);
});

document.querySelectorAll('[data-prompt]').forEach((button) => {
  button.addEventListener('click', () => submitPrompt(button.dataset.prompt));
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 3, 2) * 80}ms`;
  observer.observe(element);
});
