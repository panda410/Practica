document.addEventListener("DOMContentLoaded", () => {
  console.log("Pagina Acasă a fost încărcată cu succes!");
  const pageContent = document.querySelector(".page-content");
  if (pageContent) {
    pageContent.classList.add("active");
  }

  const playAudioButtons = document.querySelectorAll(".play-audio-btn");
  playAudioButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const audio = button.parentElement.querySelector("audio");
      if (audio.paused) {
        audio.play();
        button.innerHTML = '<i class="bi bi-pause-circle"></i> Pauză';
      } else {
        audio.pause();
        button.innerHTML = '<i class="bi bi-play-circle"></i> Redă';
      }
    });
  });
});
