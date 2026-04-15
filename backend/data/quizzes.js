const QUIZZES = [
  // ── Module 1: Intro to AI & ML ───────────────────────────────────────────
  {
    quizId: 'quiz-intro-to-ai-ml',
    moduleId: 'intro-to-ai-ml',
    title: 'Introduction to AI & ML: Test Your Knowledge',
    timeLimit: 300,
    passingScore: 70,
    xpReward: 50,
    xpBonusPerfect: 100,
    questions: [
      { id: 'q1', type: 'multiple-choice', question: 'Which of the following is NOT a type of Machine Learning?', options: ['Supervised Learning', 'Unsupervised Learning', 'Compiled Learning', 'Reinforcement Learning'], correctIndex: 2, explanation: "'Compiled Learning' doesn't exist. The three main types are supervised, unsupervised, and reinforcement learning." },
      { id: 'q2', type: 'true-false', question: 'Deep Learning is a subset of Machine Learning.', correct: true, explanation: 'Correct! Deep Learning uses neural networks — a specific technique within Machine Learning.' },
      { id: 'q3', type: 'multiple-choice', question: 'In supervised learning, training data consists of:', options: ['Only inputs', 'Only outputs', 'Inputs paired with correct outputs (labels)', 'Random unlabeled data'], correctIndex: 2, explanation: 'Supervised learning requires labeled data — each input example paired with its correct output.' },
      { id: 'q4', type: 'multiple-choice', question: 'Which ML type would you use to group customers into segments without predefined categories?', options: ['Supervised Learning', 'Unsupervised Learning', 'Reinforcement Learning', 'Transfer Learning'], correctIndex: 1, explanation: 'Unsupervised learning discovers patterns and groupings in data without predefined labels.' },
      { id: 'q5', type: 'true-false', question: 'In ML, you provide data and correct answers, and the algorithm discovers the rules.', correct: true, explanation: 'This is the fundamental flip from traditional programming — ML learns rules from examples.' },
      { id: 'q6', type: 'multiple-choice', question: "What are 'features' in Machine Learning?", options: ['The output predictions', 'The input variables used for prediction', 'The algorithm type', 'The training speed'], correctIndex: 1, explanation: 'Features are the input variables (columns in your dataset) the model uses to make predictions.' },
      { id: 'q7', type: 'multiple-choice', question: 'Why do we split data into training and test sets?', options: ['To make training faster', 'To evaluate how well the model generalizes to new data', 'Because we have too much data', 'To reduce the number of features'], correctIndex: 1, explanation: 'Test data evaluates whether the model generalizes to new, unseen examples.' },
      { id: 'q8', type: 'multiple-choice', question: 'Which AI type currently exists and is widely deployed?', options: ['General AI (Strong AI)', 'Super AI', 'Narrow AI (Weak AI)', 'All of the above'], correctIndex: 2, explanation: 'Only Narrow AI exists today — designed for specific tasks like image recognition or translation.' },
      { id: 'q9', type: 'true-false', question: 'Reinforcement Learning requires labeled training data, just like supervised learning.', correct: false, explanation: 'Reinforcement Learning learns through rewards and penalties from interacting with an environment — no labeled data needed.' },
      { id: 'q10', type: 'multiple-choice', question: 'Which is the correct hierarchy?', options: ['ML ⊃ AI ⊃ DL', 'AI ⊃ DL ⊃ ML', 'AI ⊃ ML ⊃ DL', 'DL ⊃ ML ⊃ AI'], correctIndex: 2, explanation: 'AI is broadest, ML is a subset of AI, and Deep Learning is a subset of ML.' },
    ],
  },

  // ── Module 2: Linear Regression ─────────────────────────────────────────
  {
    quizId: 'quiz-linear-regression',
    moduleId: 'linear-regression',
    title: 'Linear Regression: Test Your Knowledge',
    timeLimit: 360,
    passingScore: 70,
    xpReward: 50,
    xpBonusPerfect: 100,
    questions: [
      { id: 'q1', type: 'multiple-choice', question: 'In y = wx + b, what does w represent?', options: ['The y-intercept', 'The slope (how much y changes per unit of x)', 'The loss value', 'The learning rate'], correctIndex: 1, explanation: 'w is the slope — it tells you how much the output y changes for every 1-unit increase in x.' },
      { id: 'q2', type: 'multiple-choice', question: 'Which loss function is more sensitive to outliers?', options: ['MAE', 'MSE', 'They are equally sensitive'], correctIndex: 1, explanation: 'MSE squares the errors, so large outliers have a disproportionate impact on the computed loss.' },
      { id: 'q3', type: 'true-false', question: 'Gradient descent moves in the direction of the gradient to minimize loss.', correct: false, explanation: 'Gradient descent moves OPPOSITE to the gradient (downhill) to minimize loss.' },
      { id: 'q4', type: 'multiple-choice', question: 'What happens if the learning rate is too large?', options: ['Training is just slower', 'The loss may diverge', 'The model achieves perfect accuracy', 'Regularization improves'], correctIndex: 1, explanation: 'Too large a learning rate causes overshooting — the parameters jump past the optimal values and the loss may increase.' },
      { id: 'q5', type: 'multiple-choice', question: 'One epoch means:', options: ['One gradient update', 'One full pass through the entire training dataset', 'Training until convergence', 'Evaluating on the test set'], correctIndex: 1, explanation: 'One epoch = one complete pass through all training examples.' },
      { id: 'q6', type: 'true-false', question: 'MSE is always preferred over MAE because it is more commonly used.', correct: false, explanation: 'There is no universal winner. MAE is more robust to outliers. The choice depends on the problem.' },
      { id: 'q7', type: 'multiple-choice', question: 'Gradient descent gets stuck when:', options: ['The loss is zero', 'The gradient is zero', 'The learning rate is too small', 'There are too many features'], correctIndex: 1, explanation: 'When the gradient is zero, gradient descent stops updating parameters. This is convergence (hopefully at the minimum).' },
      { id: 'q8', type: 'multiple-choice', question: "What does R² score of 0 mean?", options: ['The model is perfect', 'The model is no better than predicting the mean', 'The model is very bad', 'The model has overfit'], correctIndex: 1, explanation: "R²=0 means the model explains 0% of the variance — equivalent to just predicting the mean for every example." },
    ],
  },

  // ── Module 3: Logistic Regression ───────────────────────────────────────
  {
    quizId: 'quiz-logistic-regression',
    moduleId: 'logistic-regression',
    title: 'Logistic Regression: Test Your Knowledge',
    timeLimit: 300,
    passingScore: 70,
    xpReward: 50,
    xpBonusPerfect: 100,
    questions: [
      { id: 'q1', type: 'multiple-choice', question: 'Logistic regression is used for:', options: ['Predicting continuous values', 'Classification (predicting categories)', 'Clustering', 'Dimensionality reduction'], correctIndex: 1, explanation: 'Despite its name, logistic regression is a classification algorithm that predicts probabilities for discrete classes.' },
      { id: 'q2', type: 'multiple-choice', question: 'The sigmoid function output range is:', options: ['(-∞, +∞)', '[0, 1]', '[-1, 1]', '[0, ∞)'], correctIndex: 1, explanation: 'The sigmoid maps any real number to the range (0, 1), making it interpretable as a probability.' },
      { id: 'q3', type: 'true-false', question: "If the sigmoid outputs 0.73 with a threshold of 0.5, the predicted class is 1.", correct: true, explanation: "0.73 > 0.5, so the prediction is class 1 (73% confidence)." },
      { id: 'q4', type: 'multiple-choice', question: 'Logistic regression uses which loss function?', options: ['MSE', 'MAE', 'Log Loss (Binary Cross-Entropy)', 'Hinge Loss'], correctIndex: 2, explanation: 'Log Loss is designed for probability outputs. It heavily penalizes confident wrong predictions.' },
      { id: 'q5', type: 'multiple-choice', question: 'L2 regularization does what?', options: ['Zeros out irrelevant features', 'Shrinks all weights toward zero', 'Increases model complexity', 'Removes outliers from data'], correctIndex: 1, explanation: 'L2 (Ridge) regularization adds λΣw² to the loss, penalizing large weights and shrinking all of them toward zero.' },
      { id: 'q6', type: 'true-false', question: 'Regularization helps prevent overfitting.', correct: true, explanation: 'Regularization penalizes model complexity, preventing the model from fitting noise in the training data.' },
    ],
  },

  // ── Module 4: Classification ─────────────────────────────────────────────
  {
    quizId: 'quiz-classification',
    moduleId: 'classification',
    title: 'Classification: Test Your Knowledge',
    timeLimit: 300,
    passingScore: 70,
    xpReward: 50,
    xpBonusPerfect: 100,
    questions: [
      { id: 'q1', type: 'multiple-choice', question: 'A False Negative in spam detection means:', options: ['A spam email incorrectly flagged as spam', 'A spam email that was NOT flagged as spam', 'A legitimate email incorrectly flagged as spam', 'A legitimate email correctly delivered'], correctIndex: 1, explanation: 'FN = the model predicted negative (not spam) but the actual label was positive (spam). A missed spam email.' },
      { id: 'q2', type: 'multiple-choice', question: 'Accuracy is misleading when:', options: ['The dataset is balanced', 'The classes are imbalanced', 'You have too many features', 'The model is linear'], correctIndex: 1, explanation: 'On imbalanced datasets, a model predicting only the majority class gets high accuracy while being completely useless.' },
      { id: 'q3', type: 'multiple-choice', question: 'For cancer detection, the most important metric is:', options: ['Precision', 'Recall', 'Accuracy', 'AUC'], correctIndex: 1, explanation: 'Recall (sensitivity) maximizes true positives and minimizes false negatives (missed cancers). Missing cancer is far worse than a false alarm.' },
      { id: 'q4', type: 'true-false', question: 'AUC of 0.5 means the classifier performs no better than random guessing.', correct: true, explanation: 'AUC=0.5 is equivalent to random guessing. A good model has AUC > 0.7.' },
      { id: 'q5', type: 'multiple-choice', question: 'F1 score is best used when:', options: ['Classes are balanced', 'You want precision only', 'Classes are imbalanced and both FP and FN matter', 'You want recall only'], correctIndex: 2, explanation: 'F1 is the harmonic mean of precision and recall — ideal for imbalanced datasets where both error types matter.' },
      { id: 'q6', type: 'multiple-choice', question: 'Softmax is used in the output layer for:', options: ['Binary classification', 'Regression', 'Multi-class classification', 'Clustering'], correctIndex: 2, explanation: 'Softmax outputs a probability distribution over all classes, with probabilities summing to 1.' },
    ],
  },

  // ── Module 5: Numerical Data ─────────────────────────────────────────────
  {
    quizId: 'quiz-numerical-data',
    moduleId: 'numerical-data',
    title: 'Numerical Data: Test Your Knowledge',
    timeLimit: 300,
    passingScore: 70,
    xpReward: 50,
    xpBonusPerfect: 100,
    questions: [
      { id: 'q1', type: 'multiple-choice', question: 'Why do we scale numerical features?', options: ['To reduce dataset size', 'So gradient descent converges faster and more stably', 'To remove outliers', 'To one-hot encode values'], correctIndex: 1, explanation: 'Features with large ranges dominate gradients. Scaling ensures all features contribute equally.' },
      { id: 'q2', type: 'multiple-choice', question: 'Min-Max normalization maps values to:', options: ['Mean=0, Std=1', '[0, 1]', '[-1, 1]', 'The original distribution'], correctIndex: 1, explanation: 'Min-Max normalization maps values to the range [0, 1] using: (x - min) / (max - min).' },
      { id: 'q3', type: 'true-false', question: 'Standardization (Z-score) produces a distribution with mean=0 and std=1.', correct: true, explanation: 'Standardization: (x - mean) / std. Produces zero-mean, unit-variance data.' },
      { id: 'q4', type: 'multiple-choice', question: 'Binning is useful when:', options: ['You want more features', 'The relationship between feature and target changes at thresholds', 'You have too little data', 'Features are already normalized'], correctIndex: 1, explanation: 'Binning helps capture threshold effects — like tax brackets where the relationship changes at specific income levels.' },
      { id: 'q5', type: 'true-false', question: "Missing values should always be filled with 0.", correct: false, explanation: 'Filling with 0 can mislead the model. Better strategies include mean/median imputation, or creating a separate "missing" indicator feature.' },
    ],
  },

  // ── Module 7: Overfitting ────────────────────────────────────────────────
  {
    quizId: 'quiz-overfitting',
    moduleId: 'overfitting',
    title: 'Overfitting & Generalization: Test Your Knowledge',
    timeLimit: 300,
    passingScore: 70,
    xpReward: 50,
    xpBonusPerfect: 100,
    questions: [
      { id: 'q1', type: 'multiple-choice', question: 'A model with 99% training accuracy and 60% test accuracy is:', options: ['Underfitting', 'Well-generalized', 'Overfitting', 'Using wrong loss'], correctIndex: 2, explanation: 'The large train-test gap is the classic sign of overfitting — memorizing training data instead of learning patterns.' },
      { id: 'q2', type: 'multiple-choice', question: 'Why should you only evaluate on the test set once?', options: ['It is computationally expensive', "Repeated peeking causes you to inadvertently optimize for the test set", 'The test set changes over time', 'Test evaluation is inaccurate'], correctIndex: 1, explanation: "If you repeatedly check test performance and adjust accordingly, you're implicitly optimizing for the test set — giving an overoptimistic estimate of real-world performance." },
      { id: 'q3', type: 'multiple-choice', question: 'L1 regularization creates:', options: ['Dense models with large weights', 'Sparse models with some weights at exactly 0', 'Models with equal-sized weights', 'No change to the model'], correctIndex: 1, explanation: 'L1 (Lasso) drives irrelevant feature weights to exactly 0, creating a sparse model that ignores unimportant features.' },
      { id: 'q4', type: 'true-false', question: 'A high train loss AND high validation loss indicates overfitting.', correct: false, explanation: 'High train + high validation loss indicates UNDERFITTING (model too simple). Overfitting shows low train loss but high validation loss.' },
      { id: 'q5', type: 'multiple-choice', question: 'What does "model capacity" mean?', options: ['Memory usage', "The model's ability to learn complex patterns", 'Training dataset size', 'Number of output classes'], correctIndex: 1, explanation: "Model capacity refers to its complexity and expressiveness — higher capacity means it can fit more complex patterns (but also overfit more easily)." },
      { id: 'q6', type: 'multiple-choice', question: 'Wild oscillation in the loss curve most likely means:', options: ['Overfitting', 'The learning rate is too high', 'Underfitting', 'Too many epochs'], correctIndex: 1, explanation: "Oscillating or diverging loss is a classic sign of too-large learning rate — the optimizer is taking steps that are too big and overshooting." },
    ],
  },

  // ── Module 8: Neural Networks ────────────────────────────────────────────
  {
    quizId: 'quiz-neural-networks',
    moduleId: 'neural-networks',
    title: 'Neural Networks: Test Your Knowledge',
    timeLimit: 300,
    passingScore: 70,
    xpReward: 50,
    xpBonusPerfect: 100,
    questions: [
      { id: 'q1', type: 'multiple-choice', question: 'The purpose of activation functions is:', options: ['To reduce training time', 'To introduce non-linearity so the network learns complex patterns', 'To normalize inputs', 'To reduce overfitting'], correctIndex: 1, explanation: 'Without activation functions, a neural network is just a linear transformation regardless of depth. Non-linearity is what makes deep learning powerful.' },
      { id: 'q2', type: 'multiple-choice', question: 'ReLU stands for:', options: ['Real Linear Unit', 'Rectified Linear Unit', 'Recursive Learning Unit', 'Random Linear Update'], correctIndex: 1, explanation: 'ReLU = Rectified Linear Unit, defined as max(0, x). It is the most widely used activation function for hidden layers.' },
      { id: 'q3', type: 'true-false', question: 'Adding more layers always improves model performance.', correct: false, explanation: 'More layers add capacity but also risk overfitting, slower training, and vanishing/exploding gradients. More is not always better.' },
      { id: 'q4', type: 'multiple-choice', question: 'Backpropagation computes:', options: ['The model output', 'Gradients of the loss w.r.t. each weight', 'The optimal learning rate', 'Test accuracy'], correctIndex: 1, explanation: 'Backprop uses the chain rule of calculus to efficiently compute how each weight contributed to the loss.' },
      { id: 'q5', type: 'multiple-choice', question: 'Softmax is used in the output layer for:', options: ['Regression', 'Binary classification only', 'Multi-class classification', 'Feature normalization'], correctIndex: 2, explanation: 'Softmax converts raw scores (logits) into a probability distribution over all classes, summing to 1.' },
      { id: 'q6', type: 'true-false', question: 'A "deep" neural network simply means it has many hidden layers.', correct: true, explanation: 'Deep learning refers to networks with multiple (deep) hidden layers, enabling hierarchical feature learning.' },
    ],
  },

  // ── Module 11: LLMs ──────────────────────────────────────────────────────
  {
    quizId: 'quiz-llms',
    moduleId: 'llms',
    title: 'Large Language Models: Test Your Knowledge',
    timeLimit: 300,
    passingScore: 70,
    xpReward: 50,
    xpBonusPerfect: 100,
    questions: [
      { id: 'q1', type: 'multiple-choice', question: 'A language model is fundamentally trained to:', options: ['Classify images', 'Predict the next word/token given context', 'Cluster documents', 'Translate code to English'], correctIndex: 1, explanation: 'LLMs learn by predicting the next token. All other capabilities (reasoning, translation) emerge from this fundamental task.' },
      { id: 'q2', type: 'multiple-choice', question: 'The key innovation in the Transformer architecture is:', options: ['Convolutional layers', 'Self-attention mechanism', 'Recurrent connections', 'Pooling layers'], correctIndex: 1, explanation: "Self-attention allows every token to attend to every other token, regardless of position — capturing long-range dependencies that RNNs couldn't." },
      { id: 'q3', type: 'true-false', question: 'Fine-tuning an LLM requires training from scratch on new data.', correct: false, explanation: 'Fine-tuning CONTINUES training a pre-trained model on new domain-specific data — far less compute than training from scratch.' },
      { id: 'q4', type: 'multiple-choice', question: 'Prompt engineering requires:', options: ['Modifying model weights', 'Crafting input prompts to guide LLM behavior without re-training', 'Access to training data', 'Significant compute resources'], correctIndex: 1, explanation: 'Prompt engineering guides model behavior through the input text alone — no re-training needed.' },
    ],
  },

  // ── Module 15: AI Ethics ─────────────────────────────────────────────────
  {
    quizId: 'quiz-ai-ethics',
    moduleId: 'ai-ethics',
    title: 'AI Ethics & Fairness: Test Your Knowledge',
    timeLimit: 300,
    passingScore: 70,
    xpReward: 50,
    xpBonusPerfect: 100,
    questions: [
      { id: 'q1', type: 'multiple-choice', question: 'Data bias most commonly occurs when:', options: ['The model is too large', 'Training data does not represent the full population', 'The learning rate is wrong', 'You have too many features'], correctIndex: 1, explanation: 'If training data over- or under-represents certain groups, the model inherits and often amplifies those biases.' },
      { id: 'q2', type: 'true-false', question: 'A high overall accuracy means the model is fair to all demographic groups.', correct: false, explanation: 'High overall accuracy can mask poor performance for minority subgroups. Disaggregated evaluation by subgroup is essential.' },
      { id: 'q3', type: 'multiple-choice', question: 'It is mathematically possible to satisfy all fairness criteria simultaneously.', options: ['True', 'False — they often conflict', 'Only when base rates are equal', 'Only with enough data'], correctIndex: 1, explanation: "Fairness criteria (demographic parity, equal opportunity, predictive parity) mathematically conflict when base rates differ across groups — you can't satisfy all simultaneously." },
      { id: 'q4', type: 'multiple-choice', question: 'Which principle ensures people are held responsible for AI decisions?', options: ['Fairness', 'Accountability', 'Transparency', 'Privacy'], correctIndex: 1, explanation: 'Accountability means humans must remain responsible for AI-assisted decisions — especially in high-stakes domains.' },
      { id: 'q5', type: 'true-false', question: 'Technical fairness tools alone are sufficient to build ethical AI systems.', correct: false, explanation: 'Ethical AI requires organizational change, diverse teams, legal/policy frameworks, and ongoing monitoring — not just technical tools.' },
    ],
  },
];

module.exports = { QUIZZES };
