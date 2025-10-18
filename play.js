const audio = document.getElementById("audio");
const playBtn = document.getElementById("play-btn");
const timeline = document.getElementById("timeline");
const progress = document.getElementById("progress");
const currentTimeEl = document.getElementById("current-time");
const durationEl = document.getElementById("duration");

let isPlaying = false;
let isScrubbing = false; 

// Formats time in minutes:seconds
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60) || 0;
  const secs = Math.floor(seconds % 60) || 0;
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Update time and progress bar
audio.addEventListener("timeupdate", () => {
  if (!isScrubbing) {
    const progressPercent = (audio.currentTime / audio.duration) * 100;
    progress.style.width = `${progressPercent}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
});

// Set total duration once metadata is loaded
audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration); 
});

// Play/Pause button functionality
playBtn.addEventListener("click", () => {
  if (isPlaying) {
    audio.pause();
  } else {
    audio.play();
  }
});

audio.addEventListener("play", () => {
  isPlaying = true;
  playBtn.classList.add("is-playing");
});

audio.addEventListener("pause", () => {
  isPlaying = false;
  playBtn.classList.remove("is-playing");
});

// Scrubbing functionality
timeline.addEventListener("mousedown", (e) => {
  isScrubbing = true;
  audio.pause();
  updateScrub(e); 
  document.addEventListener("mousemove", updateScrub);
  document.addEventListener("mouseup", () => {
    isScrubbing = false;
    if (!audio.paused) {
      audio.play();
    } else if (isPlaying) { 
      audio.play();
    }
    document.removeEventListener("mousemove", updateScrub);
  });
});

function updateScrub(e) {
  const rect = timeline.getBoundingClientRect();
  let offsetX = e.clientX - rect.left;

  // Clamp offsetX to timeline boundaries
  if (offsetX < 0) offsetX = 0;
  if (offsetX > rect.width) offsetX = rect.width;

  const percent = offsetX / rect.width;
  audio.currentTime = percent * audio.duration;

  // Update progress bar visually during scrubbing
  progress.style.width = `${percent * 100}%`;
  currentTimeEl.textContent = formatTime(audio.currentTime);
}

// Optional: Prevent text selection while scrubbing
timeline.addEventListener("selectstart", (e) => e.preventDefault());
