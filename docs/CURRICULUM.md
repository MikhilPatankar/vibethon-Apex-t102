# Curriculum — Full Content Specification

This document defines ALL lesson content and quiz questions to be placed in `backend/data/`.
A lower model should be able to copy this content directly into the seed files.

---

## Module 1: Introduction to AI & ML (Tier 🟢 — Interactive)

**moduleId**: `intro-to-ai-ml`
**category**: `intro`
**color**: `#00d4aa`
**difficulty**: `beginner`
**estimatedMinutes**: 40
**prerequisites**: `[]`

### Lesson 1.1: What is Artificial Intelligence?

**lessonId**: `intro-what-is-ai`
**type**: `reading`
**estimatedMinutes**: 8
**xpReward**: 25

```json
{
  "sections": [
    { "type": "heading", "level": 2, "text": "What is Artificial Intelligence?" },
    { "type": "text", "body": "Artificial Intelligence (AI) refers to the simulation of human intelligence in machines. These machines are programmed to think, learn, and make decisions much like humans do — but often much faster and at a much larger scale." },
    { "type": "text", "body": "AI is everywhere in our daily lives: from voice assistants like Siri and Alexa, to Netflix recommendations, to self-driving cars. Every time your email filters spam or your phone unlocks with your face, AI is at work." },
    { "type": "callout", "style": "note", "body": "AI doesn't mean robots taking over the world! Most AI today is 'narrow AI' — it's very good at one specific task but can't do everything a human can." },
    { "type": "heading", "level": 3, "text": "Types of AI" },
    { "type": "list", "style": "unordered", "items": [
      "Narrow AI (Weak AI): Designed for a specific task. Examples: Chess engines, image recognition, chatbots.",
      "General AI (Strong AI): Hypothetical AI with human-level reasoning across all domains. Doesn't exist yet.",
      "Super AI: Hypothetical AI surpassing human intelligence. Science fiction for now."
    ]},
    { "type": "text", "body": "When people talk about AI today, they almost always mean Narrow AI. This is what we'll focus on throughout this course." },
    { "type": "heading", "level": 3, "text": "Real-World AI Applications" },
    { "type": "data-table", "caption": "Examples of AI in different industries", "headers": ["Industry", "AI Application", "What It Does"],
      "rows": [
        ["Healthcare", "Medical imaging", "Detects tumors in X-rays and MRIs"],
        ["Finance", "Fraud detection", "Flags suspicious credit card transactions"],
        ["Retail", "Recommendation engines", "Suggests products based on your history"],
        ["Transportation", "Self-driving cars", "Navigates roads using cameras and sensors"],
        ["Entertainment", "Content algorithms", "Decides what appears in your social media feed"]
      ]
    },
    { "type": "check-understanding", "question": "Which type of AI is most commonly used today?", "options": ["Super AI", "General AI (Strong AI)", "Narrow AI (Weak AI)"], "correctIndex": 2, "explanation": "Narrow AI is the only type that currently exists. It's designed to perform specific tasks very well, like image recognition or language translation." },
    { "type": "key-takeaways", "points": [
      "AI is the simulation of human intelligence in machines",
      "Narrow AI (the only type that exists today) is designed for specific tasks",
      "AI is already widely used in healthcare, finance, retail, and more"
    ]}
  ]
}
```

### Lesson 1.2: What is Machine Learning?

**lessonId**: `intro-what-is-ml`
**type**: `reading`
**estimatedMinutes**: 8
**xpReward**: 25

```json
{
  "sections": [
    { "type": "heading", "level": 2, "text": "What is Machine Learning?" },
    { "type": "text", "body": "Machine Learning (ML) is a subset of AI that enables computers to learn from data without being explicitly programmed. Instead of writing rules for every scenario, you give the machine examples (data) and it figures out the patterns on its own." },
    { "type": "callout", "style": "tip", "body": "Think of it this way: Traditional programming is 'Here are the rules, apply them.' Machine Learning is 'Here are the examples, figure out the rules.'" },
    { "type": "heading", "level": 3, "text": "Traditional Programming vs Machine Learning" },
    { "type": "data-table", "caption": "Figure 1. Two different approaches", "headers": ["Approach", "Input", "Output"],
      "rows": [
        ["Traditional Programming", "Rules + Data", "Answers"],
        ["Machine Learning", "Data + Answers", "Rules (Model)"]
      ]
    },
    { "type": "text", "body": "In traditional programming, a developer writes explicit rules. For example, to detect spam emails, you might write: 'If the email contains FREE and WINNER, mark as spam.' But spammers constantly change their tactics, so you'd need to keep updating rules forever." },
    { "type": "text", "body": "With ML, you give the computer thousands of emails labeled as 'spam' or 'not spam.' The algorithm analyzes them and learns what makes an email spammy — without you telling it the specific rules. It discovers patterns you might never think of." },
    { "type": "heading", "level": 3, "text": "The AI > ML > DL Hierarchy" },
    { "type": "text", "body": "These terms are often confused, but they have a clear hierarchy:" },
    { "type": "list", "style": "unordered", "items": [
      "Artificial Intelligence (AI): The broadest term — any machine that mimics intelligent behavior",
      "Machine Learning (ML): A subset of AI — machines that learn from data",
      "Deep Learning (DL): A subset of ML — uses neural networks with many layers"
    ]},
    { "type": "callout", "style": "important", "body": "All Deep Learning is Machine Learning, and all Machine Learning is AI. But not all AI is ML, and not all ML is Deep Learning." },
    { "type": "check-understanding", "question": "In Machine Learning, what do you provide to the system?", "options": ["Rules + Data", "Data + Expected Answers (labels)", "Only rules"], "correctIndex": 1, "explanation": "In ML, you provide data along with the correct answers (labels). The algorithm learns the rules/patterns from this labeled data." },
    { "type": "key-takeaways", "points": [
      "ML enables computers to learn patterns from data instead of explicit rules",
      "Traditional programming: Rules → Answers. ML: Data + Answers → Rules.",
      "AI ⊃ ML ⊃ Deep Learning"
    ]}
  ]
}
```

### Lesson 1.3: Types of Machine Learning

**lessonId**: `intro-types-of-ml`
**type**: `reading`
**estimatedMinutes**: 10
**xpReward**: 25

```json
{
  "sections": [
    { "type": "heading", "level": 2, "text": "The Three Types of Machine Learning" },
    { "type": "text", "body": "Machine Learning algorithms are broadly categorized into three types based on how they learn from data." },
    { "type": "heading", "level": 3, "text": "1. Supervised Learning" },
    { "type": "text", "body": "The algorithm learns from labeled data — every training example has an input and a known correct output. It's like learning with a teacher who tells you the right answer." },
    { "type": "text", "body": "Examples: Predicting house prices (input: size, location → output: price), Email spam detection (input: email text → output: spam or not), Medical diagnosis (input: symptoms → output: disease)." },
    { "type": "callout", "style": "tip", "body": "If your data comes with 'answers' (labels), it's supervised learning. If you're predicting a number, it's regression. If you're predicting a category, it's classification." },
    { "type": "heading", "level": 3, "text": "2. Unsupervised Learning" },
    { "type": "text", "body": "The algorithm works with unlabeled data — there are no correct answers provided. The algorithm must find hidden patterns or groupings on its own." },
    { "type": "text", "body": "Examples: Customer segmentation (grouping similar customers), Anomaly detection (finding unusual transactions), Topic modeling (discovering themes in documents)." },
    { "type": "heading", "level": 3, "text": "3. Reinforcement Learning" },
    { "type": "text", "body": "The algorithm learns by interacting with an environment and receiving rewards or penalties. It's like training a dog — reward good behavior, discourage bad behavior." },
    { "type": "text", "body": "Examples: Game-playing AI (AlphaGo, chess engines), Robot navigation, Self-driving cars adjusting to traffic." },
    { "type": "data-table", "caption": "Comparison of ML types", "headers": ["Type", "Data", "Goal", "Example"],
      "rows": [
        ["Supervised", "Labeled (has answers)", "Predict outcomes", "Spam detection"],
        ["Unsupervised", "Unlabeled (no answers)", "Find patterns", "Customer groups"],
        ["Reinforcement", "Environment + rewards", "Maximize reward", "Game AI"]
      ]
    },
    { "type": "check-understanding", "question": "A company wants to group its customers into segments based on purchasing behavior, without predefined categories. Which type of ML should they use?", "options": ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning"], "correctIndex": 1, "explanation": "Since there are no predefined labels (categories), this is unsupervised learning. The algorithm will discover natural groupings in the data." },
    { "type": "key-takeaways", "points": [
      "Supervised: learns from labeled data (input → known output)",
      "Unsupervised: finds patterns in unlabeled data",
      "Reinforcement: learns through trial, error, and rewards"
    ]}
  ]
}
```

### Lesson 1.4: The Machine Learning Workflow

**lessonId**: `intro-ml-workflow`
**type**: `reading`
**estimatedMinutes**: 7
**xpReward**: 25

```json
{
  "sections": [
    { "type": "heading", "level": 2, "text": "The ML Workflow: From Data to Predictions" },
    { "type": "text", "body": "Building a machine learning model follows a structured workflow. Here are the key steps:" },
    { "type": "list", "style": "ordered", "items": [
      "Define the Problem: What are you trying to predict or classify? What data do you need?",
      "Collect & Prepare Data: Gather relevant data, clean it, handle missing values, and format it properly.",
      "Choose a Model: Select an algorithm suited to your problem (linear regression, decision tree, neural network, etc.).",
      "Train the Model: Feed the training data to the algorithm. The model learns patterns from this data.",
      "Evaluate the Model: Test the model on unseen data. Measure how well it performs using metrics like accuracy or error.",
      "Tune & Improve: Adjust parameters, try different features, or switch algorithms to improve performance.",
      "Deploy & Monitor: Put the model into production and monitor its performance over time."
    ]},
    { "type": "callout", "style": "warning", "body": "This isn't a one-way process! ML is iterative. You'll often go back to earlier steps — collecting more data, trying different models, or re-evaluating your problem definition." },
    { "type": "heading", "level": 3, "text": "Key Terminology" },
    { "type": "data-table", "caption": "Essential ML terms", "headers": ["Term", "Meaning"],
      "rows": [
        ["Features", "The input variables (columns) used to make predictions"],
        ["Labels", "The output variable (answer) you're trying to predict"],
        ["Training Data", "The data used to teach the model"],
        ["Test Data", "Separate data used to evaluate model performance"],
        ["Model", "The mathematical function learned from the data"],
        ["Prediction", "The model's output when given new input"]
      ]
    },
    { "type": "check-understanding", "question": "What is the purpose of 'test data' in the ML workflow?", "options": ["To train the model", "To evaluate how well the model performs on unseen data", "To collect more features"], "correctIndex": 1, "explanation": "Test data is kept separate from training data. It's used to evaluate how well the model generalizes to new, unseen examples." },
    { "type": "key-takeaways", "points": [
      "The ML workflow: Define → Collect → Choose → Train → Evaluate → Tune → Deploy",
      "Features = inputs, Labels = outputs, Model = learned function",
      "Always test on data the model hasn't seen during training"
    ]}
  ]
}
```

### Lesson 1.5: Quiz — Test Your Knowledge

**lessonId**: `intro-quiz`
**type**: `quiz`
**estimatedMinutes**: 7
**xpReward**: 0 (XP comes from quiz submission)

This lesson just links to `quizId: "quiz-intro-to-ai-ml"`. The lesson content can be:
```json
{
  "sections": [
    { "type": "heading", "level": 2, "text": "Test Your Knowledge" },
    { "type": "text", "body": "You've completed all the lessons in this module! Take this quiz to test your understanding of AI and ML fundamentals." },
    { "type": "text", "body": "You need 70% or higher to pass. Good luck! 🎯" }
  ]
}
```

### Quiz: quiz-intro-to-ai-ml

```json
{
  "quizId": "quiz-intro-to-ai-ml",
  "moduleId": "intro-to-ai-ml",
  "title": "Introduction to AI & ML: Test Your Knowledge",
  "timeLimit": 300,
  "passingScore": 70,
  "xpReward": 50,
  "xpBonusPerfect": 100,
  "questions": [
    {
      "id": "q1", "type": "multiple-choice",
      "question": "Which of the following is NOT a type of Machine Learning?",
      "options": ["Supervised Learning", "Unsupervised Learning", "Compiled Learning", "Reinforcement Learning"],
      "correctIndex": 2,
      "explanation": "'Compiled Learning' doesn't exist. The three main types are supervised, unsupervised, and reinforcement learning."
    },
    {
      "id": "q2", "type": "true-false",
      "question": "Deep Learning is a subset of Machine Learning.",
      "correct": true,
      "explanation": "Yes! Deep Learning uses neural networks with many layers, which is a specific technique within Machine Learning."
    },
    {
      "id": "q3", "type": "multiple-choice",
      "question": "In supervised learning, what does the training data consist of?",
      "options": ["Only inputs", "Only outputs", "Inputs paired with correct outputs (labels)", "Random unlabeled data"],
      "correctIndex": 2,
      "explanation": "Supervised learning requires labeled data — each input example is paired with its correct output."
    },
    {
      "id": "q4", "type": "multiple-choice",
      "question": "Which type of ML would you use to group customers into segments without predefined categories?",
      "options": ["Supervised Learning", "Unsupervised Learning", "Reinforcement Learning", "Transfer Learning"],
      "correctIndex": 1,
      "explanation": "Unsupervised learning discovers patterns and groupings in data without labels."
    },
    {
      "id": "q5", "type": "true-false",
      "question": "In traditional programming, you provide rules and data to get answers. In ML, you provide data and answers to get rules.",
      "correct": true,
      "explanation": "This is the fundamental difference! ML flips the traditional programming paradigm."
    },
    {
      "id": "q6", "type": "multiple-choice",
      "question": "What are 'features' in Machine Learning?",
      "options": ["The output predictions", "The input variables used for prediction", "The algorithm type", "The training speed"],
      "correctIndex": 1,
      "explanation": "Features are the input variables (columns in your dataset) that the model uses to make predictions."
    },
    {
      "id": "q7", "type": "multiple-choice",
      "question": "Why do we split data into training and testing sets?",
      "options": ["To make training faster", "To evaluate how well the model generalizes to new data", "Because we have too much data", "To reduce the number of features"],
      "correctIndex": 1,
      "explanation": "Test data evaluates whether the model can generalize to new, unseen examples — not just memorize the training data."
    },
    {
      "id": "q8", "type": "multiple-choice",
      "question": "Which AI type currently exists and is widely used?",
      "options": ["General AI (Strong AI)", "Super AI", "Narrow AI (Weak AI)", "All of the above"],
      "correctIndex": 2,
      "explanation": "Only Narrow AI exists today. It's designed for specific tasks like image recognition, language translation, etc."
    },
    {
      "id": "q9", "type": "true-false",
      "question": "Reinforcement Learning requires labeled training data, just like supervised learning.",
      "correct": false,
      "explanation": "Reinforcement Learning doesn't use labeled data. Instead, the agent learns by interacting with an environment and receiving rewards or penalties."
    },
    {
      "id": "q10", "type": "multiple-choice",
      "question": "What is the correct hierarchy?",
      "options": ["ML ⊃ AI ⊃ DL", "AI ⊃ DL ⊃ ML", "AI ⊃ ML ⊃ DL", "DL ⊃ ML ⊃ AI"],
      "correctIndex": 2,
      "explanation": "AI is the broadest field. ML is a subset of AI. Deep Learning is a subset of ML."
    }
  ]
}
```

---

## Module 2: Linear Regression (Tier 🟢 — Interactive)

**moduleId**: `linear-regression`
**category**: `ml-models`
**color**: `#3b82f6`
**difficulty**: `beginner`
**estimatedMinutes**: 80
**prerequisites**: `["intro-to-ai-ml"]`

### Lesson 2.1: What is Linear Regression?

**lessonId**: `linreg-intro`

Content includes: explanation of linear models, the equation `y = wx + b`, scatter plot with best-fit line data, data table example (car weight vs fuel efficiency from Google MLCC).

### Lesson 2.2: Loss Functions — MSE & MAE  

**lessonId**: `linreg-loss`

Content includes: MSE formula, MAE formula, comparison table, interactive check-understanding ("which model has higher MSE?"), callout about outlier sensitivity.

### Lesson 2.3: Interactive Exercise — Tune Parameters

**lessonId**: `linreg-params-exercise`
**type**: `interactive`

Content: Single `interactive` section with `component: "linear-regression-slider"`.

### Lesson 2.4: Gradient Descent

**lessonId**: `linreg-gradient-descent`

Content: step-by-step gradient descent explanation, ball-on-hill analogy, learning rate effect, convergence concept.

### Lesson 2.5: Hyperparameters

**lessonId**: `linreg-hyperparameters`

Content: learning rate, epochs, batch size explanation, tips for tuning, check-understanding quiz.

### Lesson 2.6: Code Lab — Build a Regression Model

**lessonId**: `linreg-code-lab`
**type**: `code-lab`

Content: Embedded CodeEditor with starter code (sklearn linear regression).

### Lesson 2.7: Test Your Knowledge

**lessonId**: `linreg-quiz`
**type**: `quiz`

Links to `quizId: "quiz-linear-regression"`.

---

## Tier 🟡 and 🔴 Modules (3-15)

For these modules, lesson content follows the same section format but with less interactive elements. Tier 🔴 modules have minimal content (1-2 paragraphs per lesson + key takeaways).

**IMPORTANT for the builder**: Rather than specifying every word here, use the module/lesson IDs from ARCHITECTURE.md and write educational content following these rules:

1. Each lesson has 4-8 sections
2. Every lesson ends with `key-takeaways` (2-4 points)
3. Tier 🟡 lessons include at least 1 `check-understanding` question
4. Tier 🔴 lessons have `text` + `key-takeaways` only (2-3 paragraphs)
5. Every module's last lesson is type `quiz` linking to its quiz
6. Quiz questions: 8-10 per Tier 🟡 module, none for Tier 🔴

---

## Achievements Data

File: `backend/data/achievements.js`

```javascript
const ACHIEVEMENTS = [
  { id: "first-lesson", title: "First Steps", icon: "🎯", description: "Complete your first lesson", condition: "completedLessons.length >= 1" },
  { id: "bookworm", title: "Bookworm", icon: "📘", description: "Complete 10 lessons", condition: "completedLessons.length >= 10" },
  { id: "lab-rat", title: "Lab Rat", icon: "🧪", description: "Run code in playground 5 times", condition: "playgroundRuns >= 5" },
  { id: "game-on", title: "Game On", icon: "🎮", description: "Play your first mini-game", condition: "Object.keys(gameScores).length >= 1" },
  { id: "perfectionist", title: "Perfectionist", icon: "💯", description: "Score 100% on any quiz", condition: "quizResults.some(q => q.percentage === 100)" },
  { id: "on-fire", title: "On Fire", icon: "🔥", description: "Maintain a 3-day streak", condition: "streak >= 3" },
  { id: "ml-explorer", title: "ML Explorer", icon: "🤖", description: "Complete Introduction to AI & ML", condition: "modules['intro-to-ai-ml']?.status === 'completed'" },
  { id: "regression-pro", title: "Regression Pro", icon: "📈", description: "Complete Linear Regression", condition: "modules['linear-regression']?.status === 'completed'" },
  { id: "sim-runner", title: "Sim Runner", icon: "🔬", description: "Complete your first simulation", condition: "simulationsCompleted.length >= 1" },
  { id: "speed-demon", title: "Speed Demon", icon: "⚡", description: "Complete a quiz in under 2 minutes", condition: "quizCompletedUnder2Min" }
];

module.exports = { ACHIEVEMENTS };
```
