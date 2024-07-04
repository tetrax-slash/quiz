// Quiz questions
const questions = [
  {
      question: "What is the capital of France?",
      type: "text",
      answer: "Paris"
  },
  {
      question: "Which of the following are primary colors?",
      type: "checkbox",
      options: ["Red", "Green", "Blue", "Yellow"],
      answer: ["Red", "Blue", "Yellow"]
  },
  {
      question: "What is 2 + 2?",
      type: "radio",
      options: ["3", "4", "5", "6"],
      answer: "4"
  },
  {
      question: "Select the largest planet in our solar system:",
      type: "select",
      options: ["Mars", "Venus", "Jupiter", "Saturn"],
      answer: "Jupiter"
  },
  {
      question: "What is the chemical symbol for water?",
      type: "text",
      answer: "H2O"
  }
];

// Quiz state
let currentPage = 0;
const questionsPerPage = 5;
let userAnswers = [];
let timerInterval;

// DOM elements
const quizContainer = document.getElementById('quiz-container');
const prevButton = document.getElementById('prev');
const nextButton = document.getElementById('next');
const submitButton = document.getElementById('submit');
const timerDisplay = document.getElementById('timer');

// Initialize quiz
function initQuiz() {
  renderQuestions();
  updatePaginationButtons();
  startTimer(300); // 5 minutes
}

// Render questions for the current page
function renderQuestions() {
  quizContainer.innerHTML = '';
  const startIndex = currentPage * questionsPerPage;
  const endIndex = Math.min(startIndex + questionsPerPage, questions.length);

  for (let i = startIndex; i < endIndex; i++) {
      const question = questions[i];
      const questionElement = createQuestionElement(question, i);
      quizContainer.appendChild(questionElement);
  }
}

// Create HTML element for a question
function createQuestionElement(question, index) {
  const container = document.createElement('div');
  container.className = 'question-container';
  container.innerHTML = `<p>${index + 1}. ${question.question}</p>`;

  switch (question.type) {
      case 'text':
          container.innerHTML += `<input type="text" id="q${index}">`;
          break;
      case 'checkbox':
          question.options.forEach(option => {
              container.innerHTML += `
                  <label>
                      <input type="checkbox" name="q${index}" value="${option}">
                      ${option}
                  </label><br>
              `;
          });
          break;
      case 'radio':
          question.options.forEach(option => {
              container.innerHTML += `
                  <label>
                      <input type="radio" name="q${index}" value="${option}">
                      ${option}
                  </label><br>
              `;
          });
          break;
      case 'select':
          let selectHtml = `<select id="q${index}">`;
          question.options.forEach(option => {
              selectHtml += `<option value="${option}">${option}</option>`;
          });
          selectHtml += '</select>';
          container.innerHTML += selectHtml;
          break;
  }

  return container;
}

// Update pagination buttons
function updatePaginationButtons() {
  prevButton.disabled = currentPage === 0;
  nextButton.textContent = currentPage === Math.ceil(questions.length / questionsPerPage) - 1 ? 'Submit' : 'Next';
  submitButton.style.display = currentPage === Math.ceil(questions.length / questionsPerPage) - 1 ? 'inline' : 'none';
}

// Navigate to the previous page
function goToPreviousPage() {
  if (currentPage > 0) {
      currentPage--;
      renderQuestions();
      updatePaginationButtons();
  }
}

// Navigate to the next page
function goToNextPage() {
  if (currentPage < Math.ceil(questions.length / questionsPerPage) - 1) {
      currentPage++;
      renderQuestions();
      updatePaginationButtons();
  } else {
      submitQuiz();
  }
}

// Submit the quiz
function submitQuiz() {
  clearInterval(timerInterval);
  calculateScore();
}

// Calculate and display the score
function calculateScore() {
  let score = 0;
  questions.forEach((question, index) => {
      const userAnswer = getUserAnswer(index);
      if (Array.isArray(question.answer)) {
          if (arraysEqual(userAnswer, question.answer)) {
              score++;
          }
      } else if (userAnswer === question.answer) {
          score++;
      }
  });

  const percentage = (score / questions.length) * 100;
  alert(`Your score: ${score}/${questions.length} (${percentage.toFixed(2)}%)`);
}

// Get user answer for a specific question
function getUserAnswer(index) {
  const question = questions[index];
  switch (question.type) {
      case 'text':
          return document.getElementById(`q${index}`).value.trim();
      case 'checkbox':
          return Array.from(document.querySelectorAll(`input[name="q${index}"]:checked`)).map(el => el.value);
      case 'radio':
          return document.querySelector(`input[name="q${index}"]:checked`)?.value;
      case 'select':
          return document.getElementById(`q${index}`).value;
  }
}

// Helper function to compare arrays
function arraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  return arr1.every(item => arr2.includes(item)) && arr2.every(item => arr1.includes(item));
}

// Start the timer
function startTimer(duration) {
  let timer = duration;
  timerInterval = setInterval(() => {
      const minutes = Math.floor(timer / 60);
      const seconds = timer % 60;
      timerDisplay.textContent = `Time remaining: ${minutes}:${seconds.toString().padStart(2, '0')}`;
      if (--timer < 0) {
          clearInterval(timerInterval);
          submitQuiz();
      }
  }, 1000);
}

// Event listeners
prevButton.addEventListener('click', goToPreviousPage);
nextButton.addEventListener('click', goToNextPage);
submitButton.addEventListener('click', submitQuiz);

// Initialize the quiz
initQuiz();