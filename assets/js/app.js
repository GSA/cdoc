// Add your custom javascript here
console.log("Hi from Federalist");


document.addEventListener('DOMContentLoaded', function() {
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      const url = new URL(link.href);
      if (url.origin !== window.location.origin && !link.querySelector('img')) {
        link.classList.add('external-link');
        link.setAttribute('target', '_blank');
      }
    });
  });