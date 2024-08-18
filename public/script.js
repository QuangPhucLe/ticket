// public/script.js

document.addEventListener("DOMContentLoaded", () => {
  const invitationText = document.getElementById("invitation-text");
  const randomNumberElementBocSo = document.getElementById(
    "random-number-boc-so"
  );
  const buttonBocSo = document.getElementById("button-boc-so");
  let currentNumberBocSo = 0;

  const buttonDecrement = document.getElementById("button-decrement");
  const randomNumberElementGoiSo = document.getElementById(
    "random-number-goi-so"
  );
  const buttonGoiSo = document.getElementById("button-goi-so");
  let currentNumberGoiSo = 0;

  const buttonReset = document.getElementById("button-reset");
  const buttonViewHistory = document.getElementById("button-view-history");
  const historyContainer = document.getElementById("history-container");

  const audioElement = document.getElementById("audio-element");
  const audioElement1 = document.getElementById("audio-element1");

  function getCurrentDate() {
    const date = new Date();
    return date.toISOString().split("T")[0];
  }

  buttonBocSo.addEventListener("click", function () {
    currentNumberBocSo++;
    randomNumberElementBocSo.textContent = currentNumberBocSo;
    invitationText.textContent = `SỐ THỨ TỰ CỦA BẠN LÀ: ${currentNumberBocSo}`;

    console.log("Inserting into boc_so table:", currentNumberBocSo);

    // Save currentNumberBocSo to localStorage
    localStorage.setItem("currentNumberBocSo", currentNumberBocSo);
  });

  buttonGoiSo.addEventListener("click", function () {
    if (currentNumberGoiSo < currentNumberBocSo) {
      currentNumberGoiSo++;
      randomNumberElementGoiSo.textContent = currentNumberGoiSo;
      invitationText.textContent = `MỜI SỐ THỨ TỰ ${currentNumberGoiSo}`;

      const speech = new SpeechSynthesisUtterance(
        `MỜI SỐ THỨ TỰ ${currentNumberGoiSo}`
      );
      speech.lang = "vi-VN";

      speech.volume = 100;
      speech.rate = 1.2;
      speech.pitch = 200;

      speech.onend = function (event) {
        console.log("Đọc xong số:", event.utterance.text);
        audioElement.play();
      };

      window.speechSynthesis.speak(speech);
    } else {
      alert("KHÔNG THỂ GỌI SỐ LỚN HƠN SỐ ĐÃ BỐC.");
    }
  });

  buttonDecrement.addEventListener("click", function () {
    if (currentNumberBocSo > 0) {
      currentNumberBocSo--;
      randomNumberElementBocSo.textContent = currentNumberBocSo;
      invitationText.textContent = `SỐ THỨ TỰ CỦA BẠN LÀ: ${currentNumberBocSo}`;

      // Save currentNumberBocSo to localStorage
      localStorage.setItem("currentNumberBocSo", currentNumberBocSo);
    } else {
      alert("Số bốc không thể nhỏ hơn 0.");
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      currentNumberBocSo++;
      randomNumberElementBocSo.textContent = currentNumberBocSo;
      invitationText.textContent = `SỐ THỨ TỰ CỦA BẠN LÀ: ${currentNumberBocSo}`;

      // Save currentNumberBocSo to localStorage
      localStorage.setItem("currentNumberBocSo", currentNumberBocSo);
    } else if (event.key === " ") {
      if (currentNumberGoiSo < currentNumberBocSo) {
        currentNumberGoiSo++;
        randomNumberElementGoiSo.textContent = currentNumberGoiSo;
        invitationText.textContent = `MỜI SỐ THỨ TỰ ${currentNumberGoiSo}`;

        const speech = new SpeechSynthesisUtterance(
          `MỜI SỐ THỨ TỰ ${currentNumberGoiSo}`
        );
        speech.lang = "vi-VN";

        speech.volume = 100;
        speech.rate = 1;
        speech.pitch = 1;

        speech.onend = function (event) {
          console.log("Đọc xong số:", event.utterance.text);
          audioElement.play();
        };

        window.speechSynthesis.speak(speech);
      } else {
        alert("Không thể gọi số lớn hơn số đã bốc.");
      }
    }
  });

  document.addEventListener("keyup", function (event) {
    if (event.key === "Shift") {
      audioElement1.play();
    }
  });

  buttonReset.addEventListener("click", async function () {
    // Save currentNumberBocSo to MySQL
    const currentDate = getCurrentDate();
    const previousTotal = currentNumberBocSo;
    try {
      const response = await fetch("/saveHistory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date: currentDate, total: previousTotal }),
      });

      if (!response.ok) {
        throw new Error("Failed to save history");
      }

      console.log("History saved to MySQL");
    } catch (error) {
      console.error("Error saving history:", error);
    }

    // Reset counters
    currentNumberBocSo = 0;
    currentNumberGoiSo = 0;
    randomNumberElementBocSo.textContent = currentNumberBocSo;
    randomNumberElementGoiSo.textContent = currentNumberGoiSo;
    invitationText.textContent = `SỐ THỨ TỰ CỦA BẠN LÀ: ${currentNumberBocSo}`;

    // Save currentNumberBocSo to localStorage
    localStorage.setItem("lastDate", currentDate);
    localStorage.setItem("currentNumberBocSo", currentNumberBocSo);
  });

  buttonViewHistory.addEventListener("click", async function () {
    try {
      const response = await fetch("/getHistory");
      const history = await response.json();
      historyContainer.innerHTML = "";

      if (history.length === 0) {
        historyContainer.innerHTML = "<p>Không có lịch sử bốc số.</p>";
      } else {
        history.forEach((item) => {
          const historyItem = document.createElement("div");
          historyItem.className = "history-item";
          historyItem.textContent = `Ngày: ${item.date}, Tổng số bốc: ${item.total}`;
          historyContainer.appendChild(historyItem);
        });
      }

      historyContainer.style.display = "block";
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  });
});
