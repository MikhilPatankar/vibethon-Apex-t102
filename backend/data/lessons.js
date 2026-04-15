const LESSONS = [
  // ════════════════════════════════════════════════════════
  // MODULE 1: Introduction to AI & ML
  // ════════════════════════════════════════════════════════
  {
    lessonId: 'intro-what-is-ai',
    moduleId: 'intro-to-ai-ml',
    title: 'What is Artificial Intelligence?',
    type: 'reading',
    estimatedMinutes: 8,
    xpReward: 25,
    order: 1,
    content: {
      sections: [
        { type: 'heading', level: 2, text: 'What is Artificial Intelligence?' },
        { type: 'text', body: 'Artificial Intelligence (AI) refers to the simulation of human intelligence in machines. These machines are programmed to think, learn, and make decisions — but often much faster and at a far greater scale than humans.' },
        { type: 'text', body: "AI is already everywhere in daily life: voice assistants like Siri and Alexa, Netflix recommendations, spam filters, and face unlock on your phone. Every time your email filters spam or your bank flags a suspicious transaction, AI is at work." },
        { type: 'callout', style: 'note', body: "AI doesn't mean robots taking over the world! Most AI today is 'Narrow AI' — it excels at one specific task but can't do everything a human can." },
        { type: 'heading', level: 3, text: 'Types of AI' },
        { type: 'list', style: 'unordered', items: [
          'Narrow AI (Weak AI): Designed for a specific task. Examples: chess engines, image recognition, chatbots.',
          'General AI (Strong AI): Hypothetical AI with human-level reasoning across all domains. Does not exist yet.',
          'Super AI: Hypothetical AI surpassing human intelligence in every field. Science fiction for now.',
        ]},
        { type: 'data-table', caption: 'AI applications across industries', headers: ['Industry', 'AI Application', 'What It Does'], rows: [
          ['Healthcare', 'Medical imaging', 'Detects tumors in X-rays and MRIs'],
          ['Finance', 'Fraud detection', 'Flags suspicious credit card transactions'],
          ['Retail', 'Recommendation engines', 'Suggests products based on your history'],
          ['Transport', 'Self-driving cars', 'Navigates roads using cameras and sensors'],
          ['Entertainment', 'Content algorithms', 'Decides what appears in your social feed'],
        ]},
        { type: 'check-understanding', question: 'Which type of AI is most commonly used today?', options: ['Super AI', 'General AI (Strong AI)', 'Narrow AI (Weak AI)'], correctIndex: 2, explanation: "Narrow AI is the only type that currently exists. It's designed to perform specific tasks very well — like image recognition or language translation." },
        { type: 'key-takeaways', points: [
          'AI is the simulation of human intelligence in machines',
          'Only Narrow AI exists today — designed for specific tasks',
          'AI is already widely used in healthcare, finance, retail, and more',
        ]},
      ],
    },
  },
  {
    lessonId: 'intro-what-is-ml',
    moduleId: 'intro-to-ai-ml',
    title: 'What is Machine Learning?',
    type: 'reading',
    estimatedMinutes: 8,
    xpReward: 25,
    order: 2,
    content: {
      sections: [
        { type: 'heading', level: 2, text: 'What is Machine Learning?' },
        { type: 'text', body: 'Machine Learning (ML) is a subset of AI that enables computers to learn from data without being explicitly programmed. Instead of writing rules for every scenario, you give the machine examples (data) and it figures out the patterns on its own.' },
        { type: 'callout', style: 'tip', body: "Think of it this way: Traditional programming is 'Here are the rules, apply them.' Machine Learning is 'Here are the examples, figure out the rules.'" },
        { type: 'data-table', caption: 'Traditional Programming vs Machine Learning', headers: ['Approach', 'You Provide', 'System Produces'], rows: [
          ['Traditional Programming', 'Rules + Data', 'Answers'],
          ['Machine Learning', 'Data + Correct Answers', 'Rules (a Model)'],
        ]},
        { type: 'text', body: 'In traditional programming, a developer writes rules like: "If email contains FREE and WINNER, mark as spam." But spammers adapt constantly. With ML, you give thousands of examples and let the algorithm discover the rules — including patterns you might never think of.' },
        { type: 'heading', level: 3, text: 'The AI ⊃ ML ⊃ Deep Learning Hierarchy' },
        { type: 'list', style: 'unordered', items: [
          'Artificial Intelligence (AI): Broadest term — any machine mimicking intelligent behavior',
          'Machine Learning (ML): A subset of AI — machines that learn from data',
          'Deep Learning (DL): A subset of ML — uses deep neural networks with many layers',
        ]},
        { type: 'callout', style: 'important', body: 'All Deep Learning is ML, and all ML is AI. But not all AI is ML, and not all ML is Deep Learning.' },
        { type: 'check-understanding', question: 'In Machine Learning, what do you provide to the system?', options: ['Explicit rules + data', 'Data + expected answers (labels)', 'Only the rules'], correctIndex: 1, explanation: 'In ML, you provide labeled data (data paired with correct answers). The algorithm discovers the underlying rules/patterns from these examples.' },
        { type: 'key-takeaways', points: [
          'ML enables computers to learn patterns from data instead of explicit rules',
          'Traditional programming: Rules → Answers. ML: Data + Answers → Rules.',
          'AI ⊃ ML ⊃ Deep Learning',
        ]},
      ],
    },
  },
  {
    lessonId: 'intro-types-of-ml',
    moduleId: 'intro-to-ai-ml',
    title: 'Types of Machine Learning',
    type: 'reading',
    estimatedMinutes: 10,
    xpReward: 25,
    order: 3,
    content: {
      sections: [
        { type: 'heading', level: 2, text: 'The Three Types of Machine Learning' },
        { type: 'text', body: 'ML algorithms are broadly categorized into three types based on how they learn from data.' },
        { type: 'heading', level: 3, text: '1. Supervised Learning' },
        { type: 'text', body: 'The algorithm learns from labeled data — every training example has an input and a known correct output. Like learning with a teacher who shows you the right answer.' },
        { type: 'callout', style: 'tip', body: 'If your data comes with answers (labels), it\'s supervised learning. Predicting a number = regression. Predicting a category = classification.' },
        { type: 'heading', level: 3, text: '2. Unsupervised Learning' },
        { type: 'text', body: 'The algorithm works with unlabeled data — no correct answers provided. It finds hidden patterns or groupings on its own. Used for customer segmentation, anomaly detection, and topic modeling.' },
        { type: 'heading', level: 3, text: '3. Reinforcement Learning' },
        { type: 'text', body: 'The algorithm learns by interacting with an environment and collecting rewards or penalties. Like training a dog — reward good behavior, discourage bad behavior. Used in game AI, robotics, and self-driving cars.' },
        { type: 'data-table', caption: 'Comparison of the three ML types', headers: ['Type', 'Data', 'Goal', 'Example'], rows: [
          ['Supervised', 'Labeled (has answers)', 'Predict outcomes', 'Spam detection'],
          ['Unsupervised', 'Unlabeled (no answers)', 'Find patterns', 'Customer segments'],
          ['Reinforcement', 'Environment + rewards', 'Maximize reward', 'Game-playing AI'],
        ]},
        { type: 'check-understanding', question: 'A company wants to group customers into segments without predefined categories. Which ML type should they use?', options: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning'], correctIndex: 1, explanation: 'Since there are no predefined labels, this is unsupervised learning — discovering natural groupings in unlabeled data.' },
        { type: 'key-takeaways', points: [
          'Supervised: learns from labeled data (input → known output)',
          'Unsupervised: finds patterns in unlabeled data',
          'Reinforcement: learns through trial, error, and rewards',
        ]},
      ],
    },
  },
  {
    lessonId: 'intro-ml-workflow',
    moduleId: 'intro-to-ai-ml',
    title: 'The Machine Learning Workflow',
    type: 'reading',
    estimatedMinutes: 7,
    xpReward: 25,
    order: 4,
    content: {
      sections: [
        { type: 'heading', level: 2, text: 'The ML Workflow: From Data to Predictions' },
        { type: 'text', body: 'Building a machine learning model follows a structured but iterative workflow. Here are the key steps:' },
        { type: 'list', style: 'ordered', items: [
          'Define the Problem: What are you predicting? What data do you need?',
          'Collect & Prepare Data: Gather data, clean it, handle missing values, and format it.',
          'Choose a Model: Select an algorithm suited to your problem.',
          'Train the Model: Feed training data to the algorithm so it learns patterns.',
          'Evaluate the Model: Test on unseen data using metrics like accuracy or RMSE.',
          'Tune & Improve: Adjust parameters or try different algorithms.',
          'Deploy & Monitor: Put the model into production and track its performance.',
        ]},
        { type: 'callout', style: 'warning', body: "This isn't a one-way process! ML is iterative. You'll often loop back — collecting more data, re-evaluating your problem, or trying different models." },
        { type: 'data-table', caption: 'Essential ML terminology', headers: ['Term', 'Meaning'], rows: [
          ['Features', 'Input variables (columns) used to make predictions'],
          ['Labels', 'Output variable (the answer) you\'re trying to predict'],
          ['Training Data', 'Data used to teach the model'],
          ['Test Data', 'Separate data used to evaluate model performance'],
          ['Model', 'The mathematical function learned from training data'],
          ['Prediction', "The model's output when given new input"],
        ]},
        { type: 'check-understanding', question: "What is the purpose of 'test data'?", options: ['To train the model', 'To evaluate performance on unseen data', 'To collect more features'], correctIndex: 1, explanation: "Test data is kept separate from training data. It tells you how well the model generalizes to new, unseen examples." },
        { type: 'key-takeaways', points: [
          'Workflow: Define → Collect → Choose → Train → Evaluate → Tune → Deploy',
          'Features = inputs, Labels = outputs, Model = learned function',
          'Always evaluate on data the model has never seen during training',
        ]},
      ],
    },
  },
  {
    lessonId: 'intro-quiz-lesson',
    moduleId: 'intro-to-ai-ml',
    title: 'Test Your Knowledge',
    type: 'quiz',
    estimatedMinutes: 7,
    xpReward: 0,
    order: 5,
    content: {
      sections: [
        { type: 'heading', level: 2, text: 'Test Your Knowledge 🎯' },
        { type: 'text', body: "You've completed all 4 lessons in this module! Take this quiz to check your understanding of AI and ML fundamentals." },
        { type: 'callout', style: 'tip', body: 'You need 70% or higher to pass and earn your XP. You can retake the quiz as many times as you like!' },
      ],
    },
  },

  // ════════════════════════════════════════════════════════
  // MODULE 2: Linear Regression
  // ════════════════════════════════════════════════════════
  {
    lessonId: 'linreg-intro',
    moduleId: 'linear-regression',
    title: 'What is Linear Regression?',
    type: 'reading',
    estimatedMinutes: 10,
    xpReward: 25,
    order: 1,
    content: {
      sections: [
        { type: 'heading', level: 2, text: 'What is Linear Regression?' },
        { type: 'text', body: 'Linear regression is one of the simplest and most widely used ML algorithms. It models the relationship between input features and a continuous output by fitting a straight line (or hyperplane) through the data.' },
        { type: 'text', body: 'The model equation is: y = wx + b, where y is the prediction, x is the input feature, w is the weight (slope), and b is the bias (y-intercept).' },
        { type: 'callout', style: 'tip', body: 'Think of w as "how much does y change per unit of x?" and b as "what is y when x = 0?"' },
        { type: 'data-table', caption: 'Figure 1. Car weight vs fuel efficiency', headers: ['Weight (×1000 lbs)', 'Miles per Gallon'], rows: [
          [2.37, 24], [2.94, 19], [3.19, 18], [3.44, 18],
          [3.43, 16], [3.69, 15], [4.34, 15], [4.42, 14],
        ]},
        { type: 'text', body: 'Looking at this data, heavier cars tend to have worse fuel efficiency. Linear regression finds the best-fit line through these points that minimizes prediction error.' },
        { type: 'check-understanding', question: 'In the equation y = wx + b, what does "w" represent?', options: ['The y-intercept (bias)', 'The slope (weight) — how much y changes per unit of x', 'The loss value', 'The learning rate'], correctIndex: 1, explanation: 'w is the slope of the line. It represents how much the output y changes for every 1-unit increase in the input x.' },
        { type: 'key-takeaways', points: [
          'Linear regression models the relationship between inputs and a continuous output',
          'The equation y = wx + b defines a line: w is the slope, b is the intercept',
          'The goal is to find w and b values that best fit the training data',
        ]},
      ],
    },
  },
  {
    lessonId: 'linreg-loss',
    moduleId: 'linear-regression',
    title: 'Loss Functions: MSE & MAE',
    type: 'reading',
    estimatedMinutes: 10,
    xpReward: 25,
    order: 2,
    content: {
      sections: [
        { type: 'heading', level: 2, text: 'Loss Functions: Measuring How Wrong Your Model Is' },
        { type: 'text', body: 'A loss function (also called a cost function) measures how far your model\'s predictions are from the actual values. The goal of training is to minimize this loss.' },
        { type: 'heading', level: 3, text: 'Mean Squared Error (MSE)' },
        { type: 'text', body: 'MSE = (1/n) × Σ(predicted - actual)². It squares each error before averaging, which means large errors are penalized much more heavily than small ones.' },
        { type: 'heading', level: 3, text: 'Mean Absolute Error (MAE)' },
        { type: 'text', body: 'MAE = (1/n) × Σ|predicted - actual|. It takes the absolute value of each error, treating all errors equally regardless of size.' },
        { type: 'data-table', caption: 'MSE vs MAE comparison', headers: ['Property', 'MSE', 'MAE'], rows: [
          ['Formula', '(1/n)Σ(pred - actual)²', '(1/n)Σ|pred - actual|'],
          ['Outlier sensitivity', 'High (squares large errors)', 'Low (treats all equally)'],
          ['Differentiable', 'Yes (everywhere)', 'No (at zero)'],
          ['Most common for', 'Regression training', 'Robust regression'],
        ]},
        { type: 'callout', style: 'tip', body: 'MSE is the most commonly used loss for regression because it\'s smooth and differentiable — which makes gradient descent work well.' },
        { type: 'check-understanding', question: 'Which loss function is more sensitive to outliers?', options: ['MAE', 'MSE'], correctIndex: 1, explanation: 'MSE squares the errors, so a large outlier (say, an error of 10) contributes 100 to the loss instead of just 10. This makes MSE disproportionately sensitive to outliers.' },
        { type: 'key-takeaways', points: [
          'Loss functions measure how wrong the model\'s predictions are',
          'MSE squares errors — heavily penalizes large mistakes, more sensitive to outliers',
          'MAE uses absolute errors — more robust to outliers but harder to optimize',
          'Training goal: minimize loss by finding optimal w and b',
        ]},
      ],
    },
  },
  {
    lessonId: 'linreg-params-exercise',
    moduleId: 'linear-regression',
    title: '✨ Interactive: Tune the Parameters',
    type: 'interactive',
    estimatedMinutes: 5,
    xpReward: 30,
    order: 3,
    content: {
      sections: [
        { type: 'heading', level: 2, text: 'Interactive Exercise: Tune w and b' },
        { type: 'text', body: 'Use the sliders below to adjust the weight (w) and bias (b) and watch the regression line move. Try to minimize the MSE displayed on the right!' },
        { type: 'interactive', component: 'linear-regression-slider', props: {
          dataPoints: [[1, 2.5], [2, 4.2], [3, 6.1], [4, 7.8], [5, 10.2], [6, 11.5], [7, 13.8]],
          initialW: 1.0,
          initialB: 0.0,
          wRange: [-3, 5],
          bRange: [-5, 10],
        }},
        { type: 'callout', style: 'tip', body: 'The optimal values are approximately w ≈ 1.9 and b ≈ 0.5. Can you get the MSE below 0.2?' },
      ],
    },
  },
  {
    lessonId: 'linreg-gradient-descent',
    moduleId: 'linear-regression',
    title: 'Gradient Descent',
    type: 'reading',
    estimatedMinutes: 10,
    xpReward: 25,
    order: 4,
    content: {
      sections: [
        { type: 'heading', level: 2, text: 'Gradient Descent: How Models Learn' },
        { type: 'text', body: 'Gradient descent is the optimization algorithm that trains most ML models. Instead of guessing w and b, it iteratively adjusts them to reduce the loss.' },
        { type: 'callout', style: 'tip', body: 'Imagine you\'re blindfolded on a hilly landscape trying to reach the lowest point. You feel which direction is downhill and take a small step that way. Gradient descent is exactly this — but in the loss landscape.' },
        { type: 'list', style: 'ordered', items: [
          'Start with random values for w and b',
          'Calculate the loss (MSE) with current values',
          'Compute the gradient — the direction of steepest increase in loss',
          'Update w and b in the opposite direction (downhill): w = w - lr × gradient',
          'Repeat until loss stops decreasing (convergence)',
        ]},
        { type: 'text', body: 'The update rule is: parameter = parameter - (learning_rate × gradient). The learning rate controls how big each step is.' },
        { type: 'check-understanding', question: 'In gradient descent, parameters are updated in which direction?', options: ['In the direction of the gradient (uphill)', 'Opposite to the gradient (downhill)', 'Randomly'], correctIndex: 1, explanation: 'We want to minimize loss, so we move opposite to the gradient (downhill on the loss surface). The learning rate controls the step size.' },
        { type: 'key-takeaways', points: [
          'Gradient descent iteratively adjusts parameters to minimize loss',
          'Parameters update: param = param - (lr × gradient)',
          'Convergence = when loss stops decreasing significantly',
        ]},
      ],
    },
  },
  {
    lessonId: 'linreg-hyperparameters',
    moduleId: 'linear-regression',
    title: 'Hyperparameters: Learning Rate & Epochs',
    type: 'reading',
    estimatedMinutes: 10,
    xpReward: 25,
    order: 5,
    content: {
      sections: [
        { type: 'heading', level: 2, text: 'Hyperparameters: Settings You Control' },
        { type: 'text', body: 'Unlike model parameters (w, b) that the algorithm learns, hyperparameters are settings you choose before training. The two most important for gradient descent are learning rate and epochs.' },
        { type: 'heading', level: 3, text: 'Learning Rate (lr)' },
        { type: 'text', body: 'Controls how big each gradient descent step is.' },
        { type: 'data-table', caption: 'Learning rate effects', headers: ['Learning Rate', 'Effect', 'Risk'], rows: [
          ['Too small (0.0001)', 'Very slow convergence', 'Takes too long or gets stuck'],
          ['Just right (0.01–0.1)', 'Smooth convergence', '—'],
          ['Too large (1.0+)', 'Fast start but overshoots', 'Diverges (loss goes up!)'],
        ]},
        { type: 'heading', level: 3, text: 'Epochs' },
        { type: 'text', body: 'One epoch = one full pass through the entire training dataset. More epochs = more learning opportunities, but also more risk of overfitting if you train too long.' },
        { type: 'callout', style: 'tip', body: 'Rule of thumb: start with lr=0.01 and 100 epochs. Watch the loss curve — if it\'s still decreasing, train longer. If it spikes, lower the learning rate.' },
        { type: 'check-understanding', question: 'What happens if the learning rate is too large?', options: ['Training is just slower than ideal', 'The model may overshoot the minimum and the loss may diverge', 'The model achieves perfect accuracy'], correctIndex: 1, explanation: 'A too-large learning rate causes the parameters to overshoot the optimal values. The loss may oscillate or even increase instead of decreasing.' },
        { type: 'key-takeaways', points: [
          'Learning rate controls step size in gradient descent',
          'Too small = slow; too large = diverges; just right = smooth convergence',
          'Epochs = number of full passes through training data',
        ]},
      ],
    },
  },
  {
    lessonId: 'linreg-code-lab',
    moduleId: 'linear-regression',
    title: '💻 Code Lab: Build a Regression Model',
    type: 'code-lab',
    estimatedMinutes: 20,
    xpReward: 50,
    order: 6,
    content: {
      sections: [
        { type: 'heading', level: 2, text: 'Code Lab: Train Your First ML Model' },
        { type: 'text', body: 'Time to write real code! Run the starter code below, then try modifying it to explore how the model changes.' },
        { type: 'code', language: 'python', caption: 'Starter code — run this first!', code: `import numpy as np
from sklearn.linear_model import LinearRegression

# Dataset: Study hours vs exam score
hours = np.array([1, 2, 3, 4, 5, 6, 7, 8]).reshape(-1, 1)
scores = np.array([45, 50, 55, 62, 70, 75, 82, 88])

# Train the model
model = LinearRegression()
model.fit(hours, scores)

print(f"Slope (w): {model.coef_[0]:.2f}")
print(f"Intercept (b): {model.intercept_:.2f}")
print(f"Equation: score = {model.coef_[0]:.2f} × hours + {model.intercept_:.2f}")
print()

# Make predictions
for h in [3, 6, 10]:
    pred = model.predict([[h]])[0]
    print(f"  {h} hours of study → predicted score: {pred:.1f}")

print(f"\\nR² Score: {model.score(hours, scores):.4f}")` },
        { type: 'callout', style: 'tip', body: 'R² (R-squared) measures how well the model explains variance in the data. R²=1.0 is perfect, R²=0 means the model is no better than guessing the mean.' },
        { type: 'list', style: 'unordered', items: [
          'Try adding a point [9, 91] to the dataset — does R² improve?',
          'Change the scores to be completely random — watch R² drop!',
          'Try predicting for 20 hours — is the result realistic?',
        ]},
      ],
    },
  },
  {
    lessonId: 'linreg-quiz-lesson',
    moduleId: 'linear-regression',
    title: 'Test Your Knowledge',
    type: 'quiz',
    estimatedMinutes: 10,
    xpReward: 0,
    order: 7,
    content: {
      sections: [
        { type: 'heading', level: 2, text: 'Test Your Knowledge 🎯' },
        { type: 'text', body: "You've completed the Linear Regression module! Take this quiz to cement your understanding." },
        { type: 'callout', style: 'tip', body: 'Score 70%+ to pass and earn XP. Perfect score earns a bonus!' },
      ],
    },
  },

  // ════════════════════════════════════════════════════════
  // MODULE 3: Logistic Regression (Tier Reading)
  // ════════════════════════════════════════════════════════
  {
    lessonId: 'logreg-intro',
    moduleId: 'logistic-regression',
    title: 'Introduction to Logistic Regression',
    type: 'reading',
    estimatedMinutes: 5,
    xpReward: 25,
    order: 1,
    content: {
      sections: [
        { type: 'heading', level: 2, text: 'From Regression to Classification' },
        { type: 'text', body: 'Linear regression predicts continuous values. But what if you need to predict a category — like "spam or not spam"? That\'s where logistic regression comes in.' },
        { type: 'text', body: 'Despite its name, logistic regression is a classification algorithm. It predicts the probability that an example belongs to a particular class (e.g., 0 or 1, yes or no).' },
        { type: 'callout', style: 'note', body: 'Logistic regression outputs a probability between 0 and 1. You apply a threshold (usually 0.5) to convert that into a class label.' },
        { type: 'key-takeaways', points: [
          'Logistic regression predicts probabilities for classification problems',
          'Output is always between 0 and 1 thanks to the sigmoid function',
          'A threshold converts probability to a class label',
        ]},
      ],
    },
  },
  {
    lessonId: 'logreg-sigmoid',
    moduleId: 'logistic-regression',
    title: 'The Sigmoid Function',
    type: 'reading',
    estimatedMinutes: 10,
    xpReward: 25,
    order: 2,
    content: {
      sections: [
        { type: 'heading', level: 2, text: 'The Sigmoid Function: Squashing to Probability' },
        { type: 'text', body: 'Logistic regression uses the sigmoid function to squash any real number into a value between 0 and 1. The formula is: σ(z) = 1 / (1 + e^(-z))' },
        { type: 'text', body: 'When z is very large (positive), σ(z) approaches 1. When z is very negative, σ(z) approaches 0. At z=0, σ(z)=0.5.' },
        { type: 'data-table', caption: 'Sigmoid output for different inputs', headers: ['z (linear output)', 'σ(z) (probability)', 'Predicted class (threshold=0.5)'], rows: [
          [-3, 0.047, 0],
          [-1, 0.269, 0],
          [0, 0.500, '0 or 1'],
          [1, 0.731, 1],
          [3, 0.953, 1],
        ]},
        { type: 'check-understanding', question: 'If the sigmoid outputs 0.73, what class would the model predict (threshold = 0.5)?', options: ['Class 0', 'Class 1', 'Cannot determine'], correctIndex: 1, explanation: '0.73 > 0.5, so the model predicts class 1. The probability of belonging to class 1 is 73%.' },
        { type: 'key-takeaways', points: [
          'Sigmoid maps any real number to the range (0, 1)',
          'σ(z) = 1 / (1 + e^(-z))',
          'Default threshold of 0.5: above = class 1, below = class 0',
        ]},
      ],
    },
  },
  {
    lessonId: 'logreg-loss',
    moduleId: 'logistic-regression',
    title: 'Loss & Regularization',
    type: 'reading',
    estimatedMinutes: 10,
    xpReward: 25,
    order: 3,
    content: {
      sections: [
        { type: 'heading', level: 2, text: 'Log Loss & Regularization' },
        { type: 'text', body: 'Logistic regression uses Log Loss (Binary Cross-Entropy) instead of MSE. Log Loss penalizes confident wrong predictions very heavily.' },
        { type: 'text', body: 'Formula: Loss = -[y × log(p) + (1-y) × log(1-p)], where y is the true label and p is the predicted probability.' },
        { type: 'callout', style: 'tip', body: 'If y=1 and the model predicts p=0.99, loss is very small. If y=1 but the model predicts p=0.01 (very confident but wrong), loss is very large.' },
        { type: 'text', body: 'Regularization adds a penalty for large weights to prevent overfitting. L2 regularization adds λΣw² to the loss, encouraging smaller weights overall.' },
        { type: 'key-takeaways', points: [
          'Logistic regression uses Log Loss, not MSE',
          'Log Loss heavily penalizes confident wrong predictions',
          'L2 regularization adds a weight penalty to prevent overfitting',
        ]},
      ],
    },
  },
  {
    lessonId: 'logreg-quiz-lesson',
    moduleId: 'logistic-regression',
    title: 'Test Your Knowledge',
    type: 'quiz',
    estimatedMinutes: 10,
    xpReward: 0,
    order: 4,
    content: {
      sections: [
        { type: 'heading', level: 2, text: 'Test Your Knowledge 🎯' },
        { type: 'text', body: 'Quiz time! Test your understanding of logistic regression.' },
      ],
    },
  },

  // ════════════════════════════════════════════════════════
  // MODULE 4: Classification (Tier Reading - abbreviated)
  // ════════════════════════════════════════════════════════
  {
    lessonId: 'class-intro',
    moduleId: 'classification',
    title: 'Introduction to Classification',
    type: 'reading',
    estimatedMinutes: 5,
    xpReward: 25,
    order: 1,
    content: {
      sections: [
        { type: 'heading', level: 2, text: 'What is Classification?' },
        { type: 'text', body: 'Classification is the task of predicting which category (class) an input belongs to. Unlike regression (continuous output), classification outputs a discrete label.' },
        { type: 'list', style: 'unordered', items: ['Binary: Two classes (spam/not spam, yes/no)', 'Multi-class: Three or more classes (cat/dog/bird)', 'Multi-label: Multiple labels per example (action movie + comedy)'] },
        { type: 'key-takeaways', points: ['Classification predicts categories, regression predicts numbers', 'Binary = 2 classes, Multi-class = 3+ classes'] },
      ],
    },
  },
  {
    lessonId: 'class-confusion-matrix',
    moduleId: 'classification',
    title: 'Thresholds & Confusion Matrix',
    type: 'reading',
    estimatedMinutes: 10,
    xpReward: 25,
    order: 2,
    content: {
      sections: [
        { type: 'heading', level: 2, text: 'The Confusion Matrix' },
        { type: 'text', body: 'A confusion matrix shows exactly how a classifier\'s predictions compare to actual labels. It breaks down predictions into 4 categories:' },
        { type: 'data-table', caption: 'Confusion Matrix', headers: ['', 'Predicted Positive', 'Predicted Negative'], rows: [
          ['Actual Positive', 'True Positive (TP) ✅', 'False Negative (FN) ❌'],
          ['Actual Negative', 'False Positive (FP) ❌', 'True Negative (TN) ✅'],
        ]},
        { type: 'callout', style: 'tip', body: 'TP and TN = correct predictions. FP = "false alarm". FN = "missed it".' },
        { type: 'key-takeaways', points: ['The confusion matrix reveals the types of errors your classifier makes', 'FP = false alarm, FN = missed detection', 'Choosing the right threshold affects the TP/FP tradeoff'] },
      ],
    },
  },
  {
    lessonId: 'class-metrics',
    moduleId: 'classification',
    title: 'Accuracy, Precision, Recall, F1',
    type: 'reading',
    estimatedMinutes: 15,
    xpReward: 25,
    order: 3,
    content: {
      sections: [
        { type: 'heading', level: 2, text: 'Classification Metrics' },
        { type: 'data-table', caption: 'Key classification metrics', headers: ['Metric', 'Formula', 'When to use'], rows: [
          ['Accuracy', '(TP + TN) / Total', 'Balanced classes'],
          ['Precision', 'TP / (TP + FP)', 'FP is costly (spam detection)'],
          ['Recall', 'TP / (TP + FN)', 'FN is costly (cancer detection)'],
          ['F1 Score', '2 × (P × R) / (P + R)', 'Imbalanced classes'],
        ]},
        { type: 'callout', style: 'warning', body: 'Accuracy is misleading on imbalanced datasets! If 99% of emails are not spam, a model that always predicts "not spam" has 99% accuracy but is useless.' },
        { type: 'check-understanding', question: 'For a cancer detection model, which metric is most critical?', options: ['Precision', 'Recall', 'Accuracy'], correctIndex: 1, explanation: 'Recall maximizes true positives and minimizes false negatives (missed cancers). Missing a cancer diagnosis (FN) is far more dangerous than a false alarm (FP).' },
        { type: 'key-takeaways', points: ['Accuracy fails on imbalanced datasets', 'Precision: minimize false alarms. Recall: minimize misses.', 'F1 is the harmonic mean of precision and recall'] },
      ],
    },
  },
  {
    lessonId: 'class-roc-auc',
    moduleId: 'classification',
    title: 'ROC Curve & AUC',
    type: 'reading',
    estimatedMinutes: 10,
    xpReward: 25,
    order: 4,
    content: {
      sections: [
        { type: 'heading', level: 2, text: 'ROC Curve & AUC Score' },
        { type: 'text', body: 'The ROC (Receiver Operating Characteristic) curve plots True Positive Rate vs False Positive Rate at every possible threshold. AUC (Area Under the Curve) summarizes overall classifier performance.' },
        { type: 'data-table', caption: 'AUC interpretation', headers: ['AUC Score', 'Interpretation'], rows: [
          ['1.0', 'Perfect classifier'],
          ['0.9 – 1.0', 'Excellent'],
          ['0.7 – 0.9', 'Good'],
          ['0.5 – 0.7', 'Fair'],
          ['0.5', 'Random guessing'],
          ['< 0.5', 'Worse than random'],
        ]},
        { type: 'key-takeaways', points: ['ROC curve shows the tradeoff between recall and false alarm rate', 'AUC of 1.0 = perfect, 0.5 = random', 'AUC works well even on imbalanced datasets'] },
      ],
    },
  },
  {
    lessonId: 'class-multiclass',
    moduleId: 'classification',
    title: 'Multi-class Classification',
    type: 'reading',
    estimatedMinutes: 5,
    xpReward: 25,
    order: 5,
    content: {
      sections: [
        { type: 'heading', level: 2, text: 'Multi-class Classification' },
        { type: 'text', body: 'When there are more than 2 classes, you use multi-class classification. Common strategies: One-vs-Rest (train one classifier per class), Softmax (output probability distribution over all classes).' },
        { type: 'callout', style: 'tip', body: 'Softmax is the go-to for neural networks. It converts raw scores (logits) into probabilities that sum to 1.0.' },
        { type: 'key-takeaways', points: ['Multi-class: predict one of 3+ categories', 'One-vs-Rest: N binary classifiers for N classes', 'Softmax: outputs probabilities summing to 1'] },
      ],
    },
  },
  {
    lessonId: 'class-quiz-lesson',
    moduleId: 'classification',
    title: 'Test Your Knowledge',
    type: 'quiz',
    estimatedMinutes: 10,
    xpReward: 0,
    order: 6,
    content: { sections: [{ type: 'heading', level: 2, text: 'Test Your Knowledge 🎯' }, { type: 'text', body: 'Quiz time! Test your understanding of classification metrics.' }] },
  },

  // ════════════════════════════════════════════════════════
  // MODULE 5: Numerical Data (Reading - abbreviated)
  // ════════════════════════════════════════════════════════
  {
    lessonId: 'numdata-feature-vectors',
    moduleId: 'numerical-data',
    title: 'Feature Vectors & Data Ingestion',
    type: 'reading', estimatedMinutes: 5, xpReward: 25, order: 1,
    content: { sections: [
      { type: 'heading', level: 2, text: 'Feature Vectors' },
      { type: 'text', body: 'Every example in a dataset is represented as a feature vector — a list of numbers. ML models can only process numbers, so all data must be converted to numerical form.' },
      { type: 'callout', style: 'note', body: 'A row in your dataset becomes a feature vector: [age=25, salary=50000, years_experience=3] → [25, 50000, 3]' },
      { type: 'key-takeaways', points: ['ML models only process numbers — all features must be numerical', 'A feature vector is one row of your dataset represented as an array'] },
    ]},
  },
  {
    lessonId: 'numdata-normalization',
    moduleId: 'numerical-data',
    title: 'Normalization & Scaling',
    type: 'reading', estimatedMinutes: 10, xpReward: 25, order: 2,
    content: { sections: [
      { type: 'heading', level: 2, text: 'Normalization & Feature Scaling' },
      { type: 'text', body: 'When features have vastly different ranges (age: 0-100, salary: 0-1,000,000), gradient descent converges slowly. Scaling brings features to similar ranges.' },
      { type: 'data-table', caption: 'Scaling methods', headers: ['Method', 'Formula', 'Output Range'], rows: [
        ['Min-Max Normalization', '(x - min) / (max - min)', '[0, 1]'],
        ['Standardization (Z-score)', '(x - mean) / std', 'Mean=0, Std=1'],
      ]},
      { type: 'check-understanding', question: 'Why do we scale features before training?', options: ['To reduce dataset size', 'So gradient descent converges faster and more stably', 'To remove outliers'], correctIndex: 1, explanation: 'Features with large ranges dominate the gradient. Scaling ensures all features contribute equally to learning.' },
      { type: 'key-takeaways', points: ['Scale features so gradient descent works efficiently', 'Min-Max: maps to [0,1]. Standardization: mean=0, std=1'] },
    ]},
  },
  {
    lessonId: 'numdata-binning',
    moduleId: 'numerical-data',
    title: 'Binning & Bucketing',
    type: 'reading', estimatedMinutes: 10, xpReward: 25, order: 3,
    content: { sections: [
      { type: 'heading', level: 2, text: 'Binning: Converting Continuous to Categorical' },
      { type: 'text', body: 'Binning groups continuous values into discrete buckets. For example, age [0-100] → [child, teen, adult, senior]. This can make models more robust to outliers and capture non-linear patterns.' },
      { type: 'callout', style: 'tip', body: 'Binning is useful when you expect the relationship between a feature and the target to change at certain thresholds (e.g., income tax brackets).' },
      { type: 'key-takeaways', points: ['Binning converts continuous values into discrete categories', 'Useful for capturing threshold effects and reducing outlier sensitivity'] },
    ]},
  },
  {
    lessonId: 'numdata-cleaning',
    moduleId: 'numerical-data',
    title: 'Data Scrubbing & Cleaning',
    type: 'reading', estimatedMinutes: 10, xpReward: 25, order: 4,
    content: { sections: [
      { type: 'heading', level: 2, text: 'Data Quality: Garbage In, Garbage Out' },
      { type: 'text', body: 'ML models are only as good as the data they train on. Common data quality issues include missing values, duplicate rows, inconsistent formats, and outliers.' },
      { type: 'data-table', caption: 'Common data issues and how to handle them', headers: ['Issue', 'Strategy'], rows: [
        ['Missing values', 'Fill with mean/median, or mark as a separate category'],
        ['Outliers', 'Cap at percentile bounds, or investigate and remove'],
        ['Duplicates', 'De-duplicate before training'],
        ['Inconsistent formats', 'Standardize (e.g., "M"/"male"/"Male" → consistent encoding)'],
      ]},
      { type: 'key-takeaways', points: ['"Garbage in, garbage out" — data quality directly impacts model quality', 'Always explore data for missing values, outliers, and inconsistencies before training'] },
    ]},
  },
  {
    lessonId: 'numdata-quiz-lesson',
    moduleId: 'numerical-data',
    title: 'Test Your Knowledge',
    type: 'quiz', estimatedMinutes: 10, xpReward: 0, order: 5,
    content: { sections: [{ type: 'heading', level: 2, text: 'Test Your Knowledge 🎯' }, { type: 'text', body: 'Quiz time!' }] },
  },

  // ════════════════════════════════════════════════════════
  // MODULE 6: Categorical Data (Tier structure)
  // ════════════════════════════════════════════════════════
  {
    lessonId: 'catdata-one-hot',
    moduleId: 'categorical-data',
    title: 'One-Hot Encoding',
    type: 'reading', estimatedMinutes: 10, xpReward: 25, order: 1,
    content: { sections: [
      { type: 'heading', level: 2, text: 'One-Hot Encoding' },
      { type: 'text', body: 'One-hot encoding converts a categorical feature with N categories into N binary columns. For example, Color = {Red, Green, Blue} becomes three columns: is_Red, is_Green, is_Blue — with exactly one "1" per row.' },
      { type: 'callout', style: 'tip', body: 'One-hot encoding prevents the model from interpreting ordinal relationships that don\'t exist (e.g., interpreting Red=1, Green=2, Blue=3 as Green being "more" than Red).' },
      { type: 'key-takeaways', points: ['One-hot encoding: N categories → N binary columns', 'Prevents false ordinal relationships in the model'] },
    ]},
  },
  {
    lessonId: 'catdata-hashing',
    moduleId: 'categorical-data',
    title: 'Feature Hashing',
    type: 'reading', estimatedMinutes: 10, xpReward: 25, order: 2,
    content: { sections: [
      { type: 'heading', level: 2, text: 'Feature Hashing' },
      { type: 'text', body: 'When a categorical feature has thousands of values (e.g., zip codes, product IDs), one-hot encoding becomes impractical. Feature hashing maps values to a fixed number of buckets using a hash function.' },
      { type: 'key-takeaways', points: ['Feature hashing handles very high-cardinality categoricals', 'Trades some accuracy for memory efficiency'] },
    ]},
  },
  {
    lessonId: 'catdata-crosses',
    moduleId: 'categorical-data',
    title: 'Feature Crosses',
    type: 'reading', estimatedMinutes: 10, xpReward: 25, order: 3,
    content: { sections: [
      { type: 'heading', level: 2, text: 'Feature Crosses' },
      { type: 'text', body: 'A feature cross combines two or more features to capture interactions. For example, crossing "day of week" × "time of day" creates a feature that captures "Monday morning" as a distinct concept.' },
      { type: 'key-takeaways', points: ['Feature crosses capture interaction effects between features', 'Particularly useful for capturing non-linear relationships in linear models'] },
    ]},
  },
  {
    lessonId: 'catdata-quiz-lesson',
    moduleId: 'categorical-data',
    title: 'Module Summary',
    type: 'reading', estimatedMinutes: 5, xpReward: 25, order: 4,
    content: { sections: [
      { type: 'heading', level: 2, text: 'Module Summary: Categorical Data' },
      { type: 'text', body: 'Great work! You\'ve learned the key techniques for handling categorical data in machine learning.' },
      { type: 'key-takeaways', points: ['One-hot encoding for low-cardinality categoricals', 'Feature hashing for high-cardinality categoricals', 'Feature crosses to capture interactions between categorical features'] },
    ]},
  },

  // ════════════════════════════════════════════════════════
  // MODULE 7: Overfitting & Generalization (Interactive)
  // ════════════════════════════════════════════════════════
  {
    lessonId: 'overfit-train-test-split',
    moduleId: 'overfitting',
    title: 'Training vs Testing Data',
    type: 'reading', estimatedMinutes: 8, xpReward: 25, order: 1,
    content: { sections: [
      { type: 'heading', level: 2, text: 'Why Split Your Data?' },
      { type: 'text', body: 'If you train and test on the same data, the model memorizes the training set and looks great — but fails on new data. Splitting data into training and test sets gives an honest estimate of real-world performance.' },
      { type: 'data-table', caption: 'Typical dataset splits', headers: ['Split', 'Size', 'Purpose'], rows: [
        ['Training', '70–80%', 'Model learns from this'],
        ['Validation', '10–15%', 'Tune hyperparameters'],
        ['Test', '10–15%', 'Final honest evaluation'],
      ]},
      { type: 'callout', style: 'warning', body: 'The test set should be touched ONLY ONCE — at the very end. "Peeking" at the test set during development leads to overoptimistic results.' },
      { type: 'key-takeaways', points: ['Always split data before training — never evaluate on training data', 'Test set = final exam, used only once', '70/10/20 or 80/20 are common splits'] },
    ]},
  },
  {
    lessonId: 'overfit-what-is-overfitting',
    moduleId: 'overfitting',
    title: 'What is Overfitting?',
    type: 'reading', estimatedMinutes: 10, xpReward: 25, order: 2,
    content: { sections: [
      { type: 'heading', level: 2, text: 'Overfitting: Memorizing Instead of Learning' },
      { type: 'text', body: 'Overfitting happens when a model learns the training data too well — including its noise and random fluctuations. The model performs great on training data but poorly on new data.' },
      { type: 'text', body: 'Think of it like a student who memorizes exact answers from a practice exam but can\'t answer slightly different questions on the real exam.' },
      { type: 'data-table', caption: 'Underfitting vs Good fit vs Overfitting', headers: ['State', 'Training Error', 'Test Error', 'Cause'], rows: [
        ['Underfitting', 'High', 'High', 'Model too simple'],
        ['Good fit', 'Low', 'Low', 'Just right'],
        ['Overfitting', 'Very low', 'High', 'Model too complex'],
      ]},
      { type: 'check-understanding', question: 'A model has 99% training accuracy but 60% test accuracy. What is this called?', options: ['Underfitting', 'Good generalization', 'Overfitting'], correctIndex: 2, explanation: 'The huge gap between train (99%) and test (60%) accuracy is the classic sign of overfitting — the model memorized training data instead of learning generalizable patterns.' },
      { type: 'key-takeaways', points: ['Overfitting: excellent training performance, poor test performance', 'The model memorizes noise instead of learning patterns', 'Goal: minimize both training AND test error'] },
    ]},
  },
  {
    lessonId: 'overfit-game-lesson',
    moduleId: 'overfitting',
    title: '🎮 Overfitting Challenge',
    type: 'game', estimatedMinutes: 10, xpReward: 30, order: 3,
    content: { sections: [
      { type: 'heading', level: 2, text: 'The Overfitting Challenge' },
      { type: 'text', body: 'In this game, you control the complexity of a polynomial model. Adjust the degree slider and watch how training vs test accuracy changes. Your goal: maximize test accuracy!' },
      { type: 'callout', style: 'tip', body: 'Degree 1 = underfitting (straight line). Degree 10+ = overfitting (wiggly line through every point). Find the sweet spot!' },
    ]},
  },
  {
    lessonId: 'overfit-regularization',
    moduleId: 'overfitting',
    title: 'Regularization: L1 & L2',
    type: 'reading', estimatedMinutes: 10, xpReward: 25, order: 4,
    content: { sections: [
      { type: 'heading', level: 2, text: 'Regularization: Fighting Overfitting' },
      { type: 'text', body: 'Regularization adds a penalty to the loss function for large weights, discouraging the model from fitting noise. The two most common types are L1 and L2.' },
      { type: 'data-table', caption: 'L1 vs L2 Regularization', headers: ['Type', 'Penalty', 'Effect', 'Produces'], rows: [
        ['L1 (Lasso)', 'λ × Σ|w|', 'Drives some weights to exactly 0', 'Sparse models'],
        ['L2 (Ridge)', 'λ × Σw²', 'Shrinks all weights toward 0', 'Small, distributed weights'],
      ]},
      { type: 'callout', style: 'tip', body: 'Use L1 when you suspect only a few features matter (it zeroes out irrelevant ones). Use L2 when all features may be relevant.' },
      { type: 'key-takeaways', points: ['Regularization adds a penalty for large weights to reduce overfitting', 'L1 (Lasso): creates sparse models by zeroing out weights', 'L2 (Ridge): shrinks all weights, keeps all features'] },
    ]},
  },
  {
    lessonId: 'overfit-loss-curves',
    moduleId: 'overfitting',
    title: 'Reading Loss Curves',
    type: 'reading', estimatedMinutes: 10, xpReward: 25, order: 5,
    content: { sections: [
      { type: 'heading', level: 2, text: 'Interpreting Training and Validation Loss Curves' },
      { type: 'text', body: 'Loss curves show how training and validation loss change over epochs. They are your primary diagnostic tool for identifying overfitting, underfitting, and convergence.' },
      { type: 'data-table', caption: 'Loss curve patterns', headers: ['Pattern', 'Diagnosis', 'Fix'], rows: [
        ['Both losses decrease together', 'Good training', 'Continue training'],
        ['Train loss still decreasing', 'Model hasn\'t converged', 'Train more epochs'],
        ['Val loss increases, train decreases', 'Overfitting', 'Regularize, more data'],
        ['Both losses stay high', 'Underfitting', 'More complex model'],
        ['Losses oscillate wildly', 'LR too high', 'Reduce learning rate'],
      ]},
      { type: 'key-takeaways', points: ['Loss curves diagnose training problems', 'Diverging train/val loss = overfitting', 'Both high = underfitting; both decreasing together = healthy training'] },
    ]},
  },
  {
    lessonId: 'overfit-quiz-lesson',
    moduleId: 'overfitting',
    title: 'Test Your Knowledge',
    type: 'quiz', estimatedMinutes: 10, xpReward: 0, order: 6,
    content: { sections: [{ type: 'heading', level: 2, text: 'Test Your Knowledge 🎯' }, { type: 'text', body: 'Quiz time!' }] },
  },

  // ════════════════════════════════════════════════════════
  // MODULE 8: Neural Networks (Reading - abbreviated)
  // ════════════════════════════════════════════════════════
  {
    lessonId: 'nn-intro',
    moduleId: 'neural-networks',
    title: 'From Biological to Artificial Neurons',
    type: 'reading', estimatedMinutes: 5, xpReward: 25, order: 1,
    content: { sections: [
      { type: 'heading', level: 2, text: 'What is a Neural Network?' },
      { type: 'text', body: 'Neural networks are loosely inspired by the human brain. A biological neuron receives signals, processes them, and fires if the signal is strong enough. An artificial neuron does the same: it takes inputs, multiplies by weights, sums them, and applies an activation function.' },
      { type: 'key-takeaways', points: ['Artificial neurons mimic biological neurons', 'Each neuron: Σ(weight × input) + bias → activation function → output'] },
    ]},
  },
  {
    lessonId: 'nn-layers',
    moduleId: 'neural-networks',
    title: 'Nodes, Layers & Hidden Layers',
    type: 'reading', estimatedMinutes: 15, xpReward: 25, order: 2,
    content: { sections: [
      { type: 'heading', level: 2, text: 'Network Architecture: Layers' },
      { type: 'text', body: 'A neural network stacks neurons into layers. The input layer receives raw features. Hidden layers learn increasingly abstract representations. The output layer produces the final prediction.' },
      { type: 'data-table', caption: 'Layer types', headers: ['Layer', 'Role'], rows: [
        ['Input Layer', 'Receives raw features (one neuron per feature)'],
        ['Hidden Layers', 'Learn abstract representations of the data'],
        ['Output Layer', 'Produces the final prediction (1 for regression, N for N-class)'],
      ]},
      { type: 'text', body: 'More hidden layers = "deeper" network = more capacity to learn complex patterns. A network with many hidden layers is called a "Deep Neural Network" — hence "Deep Learning".' },
      { type: 'key-takeaways', points: ['Input → Hidden → Output layer architecture', 'Hidden layers extract abstract features automatically', 'More layers = more expressive model (but harder to train)'] },
    ]},
  },
  {
    lessonId: 'nn-activations',
    moduleId: 'neural-networks',
    title: 'Activation Functions',
    type: 'reading', estimatedMinutes: 10, xpReward: 25, order: 3,
    content: { sections: [
      { type: 'heading', level: 2, text: 'Why Activation Functions Matter' },
      { type: 'text', body: 'Without activation functions, a neural network is just a linear transformation — no matter how many layers. Activation functions introduce non-linearity, allowing the network to learn complex patterns.' },
      { type: 'data-table', caption: 'Common activation functions', headers: ['Function', 'Formula', 'Range', 'Best For'], rows: [
        ['ReLU', 'max(0, x)', '[0, ∞)', 'Hidden layers (most common)'],
        ['Sigmoid', '1/(1+e^-x)', '(0, 1)', 'Binary output layers'],
        ['Tanh', '(e^x - e^-x)/(e^x + e^-x)', '(-1, 1)', 'Hidden (better than sigmoid)'],
        ['Softmax', 'e^xi / Σe^xj', '(0, 1)', 'Multi-class output layers'],
      ]},
      { type: 'key-takeaways', points: ['Activation functions add non-linearity — essential for learning complex patterns', 'ReLU is the go-to for hidden layers', 'Sigmoid/Softmax for output layers in classification'] },
    ]},
  },
  {
    lessonId: 'nn-backprop',
    moduleId: 'neural-networks',
    title: 'Backpropagation',
    type: 'reading', estimatedMinutes: 10, xpReward: 25, order: 4,
    content: { sections: [
      { type: 'heading', level: 2, text: 'Backpropagation: How Networks Learn' },
      { type: 'text', body: 'Backpropagation (backprop) computes gradients for every weight in the network using the chain rule of calculus. These gradients tell gradient descent which direction to update each weight.' },
      { type: 'list', style: 'ordered', items: [
        'Forward pass: Input → hidden layers → output → compute loss',
        'Backward pass: Compute gradient of loss w.r.t. each weight (chain rule)',
        'Update: All weights updated simultaneously using their gradients',
      ]},
      { type: 'key-takeaways', points: ['Backprop efficiently computes gradients for all weights via the chain rule', 'Forward pass → compute loss → backward pass → update weights', 'This is the core algorithm that makes deep learning trainable'] },
    ]},
  },
  {
    lessonId: 'nn-game-lesson',
    moduleId: 'neural-networks',
    title: '🎮 Neural Network Trainer Game',
    type: 'game', estimatedMinutes: 15, xpReward: 30, order: 5,
    content: { sections: [
      { type: 'heading', level: 2, text: 'Neural Network Trainer' },
      { type: 'text', body: 'Build and "train" a neural network visually! Choose the number of hidden neurons and learning rate, then watch the loss curve animate as the network learns.' },
      { type: 'callout', style: 'tip', body: 'Try different learning rates. Too high = loss spikes. Too low = slow convergence. Sweet spot = smooth descent!' },
    ]},
  },
  {
    lessonId: 'nn-quiz-lesson',
    moduleId: 'neural-networks',
    title: 'Test Your Knowledge',
    type: 'quiz', estimatedMinutes: 10, xpReward: 0, order: 6,
    content: { sections: [{ type: 'heading', level: 2, text: 'Test Your Knowledge 🎯' }, { type: 'text', body: 'Quiz time!' }] },
  },

 // ════════════════════════════════════════════════════════
  // MODULES 9-14: Structure-only (brief content)
  // ════════════════════════════════════════════════════════
  ...[
    { lessonId: 'dl-intro', moduleId: 'deep-learning-cnns', title: 'What is Deep Learning?', order: 1 },
    { lessonId: 'dl-conv-layers', moduleId: 'deep-learning-cnns', title: 'Convolutional Layers', order: 2 },
    { lessonId: 'dl-pooling', moduleId: 'deep-learning-cnns', title: 'Pooling & Feature Maps', order: 3 },
    { lessonId: 'dl-transfer-learning', moduleId: 'deep-learning-cnns', title: 'Transfer Learning', order: 4 },
    { lessonId: 'dl-quiz-lesson', moduleId: 'deep-learning-cnns', title: 'Module Summary', order: 5 },
    { lessonId: 'emb-intro', moduleId: 'embeddings', title: 'What are Embeddings?', order: 1 },
    { lessonId: 'emb-word2vec', moduleId: 'embeddings', title: 'Word2Vec & Embedding Spaces', order: 2 },
    { lessonId: 'emb-pretrained', moduleId: 'embeddings', title: 'Using Pre-trained Embeddings', order: 3 },
    { lessonId: 'emb-quiz-lesson', moduleId: 'embeddings', title: 'Module Summary', order: 4 },
    { lessonId: 'rl-intro', moduleId: 'reinforcement-learning', title: 'Agents, Environments & Rewards', order: 1 },
    { lessonId: 'rl-q-learning', moduleId: 'reinforcement-learning', title: 'Q-Learning Basics', order: 2 },
    { lessonId: 'rl-policy-gradient', moduleId: 'reinforcement-learning', title: 'Policy Gradient Methods', order: 3 },
    { lessonId: 'rl-quiz-lesson', moduleId: 'reinforcement-learning', title: 'Module Summary', order: 4 },
    { lessonId: 'prod-static-dynamic', moduleId: 'production-ml', title: 'Static vs Dynamic Training', order: 1 },
    { lessonId: 'prod-inference', moduleId: 'production-ml', title: 'Inference Strategies', order: 2 },
    { lessonId: 'prod-monitoring', moduleId: 'production-ml', title: 'Monitoring ML Pipelines', order: 3 },
    { lessonId: 'prod-quiz-lesson', moduleId: 'production-ml', title: 'Module Summary', order: 4 },
    { lessonId: 'automl-intro', moduleId: 'automl', title: 'What is AutoML?', order: 1 },
    { lessonId: 'automl-benefits', moduleId: 'automl', title: 'Benefits & Limitations', order: 2 },
    { lessonId: 'automl-quiz-lesson', moduleId: 'automl', title: 'Module Summary', order: 3 },
  ].map(l => ({
    ...l,
    type: 'reading',
    estimatedMinutes: 10,
    xpReward: 25,
    content: {
      sections: [
        { type: 'heading', level: 2, text: l.title },
        { type: 'text', body: `This lesson covers ${l.title.toLowerCase()} — a key concept in modern machine learning. Full interactive content coming soon!` },
        { type: 'callout', style: 'note', body: 'This module is part of our expanding curriculum. The foundations you have built in earlier modules will make this material accessible.' },
        { type: 'key-takeaways', points: [`${l.title} is an important concept in ML`, 'Complete earlier modules for the necessary background', 'Full content with examples coming in the next update'] },
      ],
    },
  })),

  // ════════════════════════════════════════════════════════
  // MODULE 11: LLMs (Reading)
  // ════════════════════════════════════════════════════════
  {
    lessonId: 'llm-intro',
    moduleId: 'llms',
    title: 'What is a Language Model?',
    type: 'reading', estimatedMinutes: 10, xpReward: 25, order: 1,
    content: { sections: [
      { type: 'heading', level: 2, text: 'What is a Language Model?' },
      { type: 'text', body: 'A language model learns the statistical patterns of language by predicting the next word given a context. Large Language Models (LLMs) like GPT-4 are trained on massive text corpora — billions of web pages, books, and articles.' },
      { type: 'key-takeaways', points: ['LLMs predict the next token given context', 'Trained on massive text datasets (hundreds of gigabytes to terabytes)', 'Scale (data + compute + parameters) is the key to capability'] },
    ]},
  },
  {
    lessonId: 'llm-transformers',
    moduleId: 'llms',
    title: 'Transformers & Attention',
    type: 'reading', estimatedMinutes: 15, xpReward: 25, order: 2,
    content: { sections: [
      { type: 'heading', level: 2, text: 'Transformers: The Architecture Behind LLMs' },
      { type: 'text', body: 'The Transformer architecture (2017, "Attention Is All You Need") revolutionized NLP. Its key innovation is the self-attention mechanism — every token can "attend" to every other token in the context, regardless of distance.' },
      { type: 'callout', style: 'tip', body: 'Attention lets the model learn: "The cat sat on the mat because it was soft" — the word "it" attends most to "mat", not "cat".' },
      { type: 'key-takeaways', points: ['Transformers use self-attention to relate all tokens to each other', 'Attention = learning which parts of the input to focus on', 'LLMs = deep stacks of Transformer blocks'] },
    ]},
  },
  {
    lessonId: 'llm-finetuning',
    moduleId: 'llms',
    title: 'Fine-Tuning & Prompt Engineering',
    type: 'reading', estimatedMinutes: 10, xpReward: 25, order: 3,
    content: { sections: [
      { type: 'heading', level: 2, text: 'Adapting LLMs to Your Task' },
      { type: 'text', body: 'Pre-trained LLMs can be adapted in two main ways: Fine-tuning (continue training on domain-specific data) and Prompt Engineering (craft input prompts to guide behavior without re-training).' },
      { type: 'data-table', caption: 'Fine-tuning vs Prompt Engineering', headers: ['Method', 'When to use', 'Cost'], rows: [
        ['Prompt Engineering', 'Quick adaptation, general tasks', 'Free (no training)'],
        ['Fine-tuning', 'Domain-specific, consistent style', 'Compute cost'],
        ['RLHF', 'Align with human preferences', 'High cost + human labelers'],
      ]},
      { type: 'key-takeaways', points: ['Prompt engineering: guide behavior via input text', 'Fine-tuning: continue training on domain data', 'RLHF: use human feedback to align model behavior'] },
    ]},
  },
  {
    lessonId: 'llm-quiz-lesson',
    moduleId: 'llms',
    title: 'Test Your Knowledge',
    type: 'quiz', estimatedMinutes: 10, xpReward: 0, order: 4,
    content: { sections: [{ type: 'heading', level: 2, text: 'Test Your Knowledge 🎯' }, { type: 'text', body: 'Quiz time!' }] },
  },

  // ════════════════════════════════════════════════════════
  // MODULE 15: AI Ethics (Reading)
  // ════════════════════════════════════════════════════════
  {
    lessonId: 'ethics-bias-types',
    moduleId: 'ai-ethics',
    title: 'Types of Bias in ML',
    type: 'reading', estimatedMinutes: 10, xpReward: 25, order: 1,
    content: { sections: [
      { type: 'heading', level: 2, text: 'Bias in Machine Learning' },
      { type: 'text', body: 'ML models can perpetuate and even amplify existing societal biases. Bias enters the pipeline at multiple stages.' },
      { type: 'data-table', caption: 'Sources of bias', headers: ['Type', 'Description', 'Example'], rows: [
        ['Data bias', 'Training data doesn\'t represent the population', 'Facial recognition trained mostly on light-skinned faces'],
        ['Label bias', 'Human annotators embed their own biases in labels', 'Resume screener labels reflecting historical hiring bias'],
        ['Algorithm bias', 'The model amplifies patterns even if unintended', 'Loan approval model penalizing zip codes correlated with race'],
      ]},
      { type: 'key-takeaways', points: ['Bias can enter at data collection, labeling, or algorithm design', 'AI systems can amplify existing societal inequalities', 'Detecting bias requires proactive measurement and diverse perspectives'] },
    ]},
  },
  {
    lessonId: 'ethics-mitigating-bias',
    moduleId: 'ai-ethics',
    title: 'Identifying & Mitigating Bias',
    type: 'reading', estimatedMinutes: 10, xpReward: 25, order: 2,
    content: { sections: [
      { type: 'heading', level: 2, text: 'How to Detect and Reduce Bias' },
      { type: 'text', body: 'Addressing bias requires both technical tools and organizational practices.' },
      { type: 'list', style: 'unordered', items: [
        'Audit data: Analyze demographic distributions in your training set',
        'Disaggregated evaluation: Measure performance separately for subgroups',
        'Fairness constraints: Add constraints to the optimization objective',
        'Diverse teams: Include diverse perspectives in model development',
      ]},
      { type: 'key-takeaways', points: ['Disaggregated metrics reveal subgroup disparities', 'Diverse teams catch blind spots', 'Technical fairness tools alone are insufficient without organizational change'] },
    ]},
  },
  {
    lessonId: 'ethics-fairness-metrics',
    moduleId: 'ai-ethics',
    title: 'Fairness Metrics',
    type: 'reading', estimatedMinutes: 10, xpReward: 25, order: 3,
    content: { sections: [
      { type: 'heading', level: 2, text: 'Quantifying Fairness' },
      { type: 'text', body: 'There are multiple mathematical definitions of fairness, and they can conflict with each other.' },
      { type: 'data-table', caption: 'Common fairness metrics', headers: ['Metric', 'Definition'], rows: [
        ['Demographic Parity', 'Equal positive prediction rates across groups'],
        ['Equal Opportunity', 'Equal true positive rates across groups'],
        ['Predictive Parity', 'Equal precision across groups'],
        ['Individual Fairness', 'Similar individuals treated similarly'],
      ]},
      { type: 'callout', style: 'warning', body: 'It is mathematically impossible to satisfy all fairness criteria simultaneously when base rates differ between groups. Fairness is a choice, not a calculation.' },
      { type: 'key-takeaways', points: ['Multiple fairness metrics exist and often conflict', 'Choosing a fairness definition is a value judgment, not purely technical', 'Document which fairness criterion you optimized for and why'] },
    ]},
  },
  {
    lessonId: 'ethics-responsible-ai',
    moduleId: 'ai-ethics',
    title: 'Responsible AI Principles',
    type: 'reading', estimatedMinutes: 10, xpReward: 25, order: 4,
    content: { sections: [
      { type: 'heading', level: 2, text: 'Responsible AI: Key Principles' },
      { type: 'list', style: 'unordered', items: [
        'Fairness: Ensure equitable outcomes across demographic groups',
        'Accountability: People must be responsible for AI decisions',
        'Transparency: Be clear about what data and methods were used',
        'Privacy: Protect personal data used in training and inference',
        'Safety: Test thoroughly before deployment, especially in high-stakes domains',
        'Inclusiveness: AI should benefit all people, not just a few',
      ]},
      { type: 'key-takeaways', points: ['Responsible AI requires technical + ethical + organizational commitment', 'No model should be deployed without understanding its failure modes', 'Human oversight remains essential, especially in high-stakes decisions'] },
    ]},
  },
  {
    lessonId: 'ethics-quiz-lesson',
    moduleId: 'ai-ethics',
    title: 'Test Your Knowledge',
    type: 'quiz', estimatedMinutes: 10, xpReward: 0, order: 5,
    content: { sections: [{ type: 'heading', level: 2, text: 'Test Your Knowledge 🎯' }, { type: 'text', body: 'Quiz time!' }] },
  },
];

module.exports = { LESSONS };
