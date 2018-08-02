export function clearLoader(timeout) {
  setTimeout(() => {
    const loader = document.getElementById("loader");
    loader.style.display = "none";
  }, timeout || 1500);
}

export function showLoader(timeout) {
  // setTimeout(() => {
    const loader = document.getElementById("loader");
    loader.style.display = "block";
  // }, timeout || 0);
}
