const updateLogsButton = document.getElementById("updateLogsButton");
const updateLogsPopup = document.getElementById("updateLogsPopup");
const updateLogsOverlay = document.getElementById("updateLogsOverlay");
const closePopupButton = document.getElementById("closePopupButton");

updateLogsButton.addEventListener("click", () => {
  updateLogsPopup.style.display = "block";
  updateLogsOverlay.style.display = "block";
});

closePopupButton.addEventListener("click", () => {
  updateLogsPopup.style.display = "none";
  updateLogsOverlay.style.display = "none";
});

updateLogsOverlay.addEventListener("click", () => {
  updateLogsPopup.style.display = "none";
  updateLogsOverlay.style.display = "none";
});
