# Interactive Features — Technical Implementation

## 1. Code Playground (Pyodide — Real Python in Browser)

### How it works
Pyodide compiles CPython 3.11 to WebAssembly. It runs REAL Python in the browser. No server needed.

### Setup
Add to `frontend/app/layout.js`:
```jsx
import Script from 'next/script';

<Script
  src="https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js"
  strategy="beforeInteractive"
/>
```

### Initialization (in CodeEditor component)
```javascript
const [pyodide, setPyodide] = useState(null);
const [loading, setLoading] = useState(false);

async function initPyodide() {
  setLoading(true);
  const py = await window.loadPyodide({
    indexURL: "https://cdn.jsdelivr.net/pyodide/v0.24.1/full/"
  });
  // Pre-install packages
  await py.loadPackage(['numpy', 'micropip']);
  const micropip = py.pyimport('micropip');
  await micropip.install(['scikit-learn', 'pandas']);
  setPyodide(py);
  setLoading(false);
}
```

### Running User Code
```javascript
async function runCode(code) {
  // Redirect stdout/stderr
  pyodide.runPython(`
    import sys, io
    sys.stdout = io.StringIO()
    sys.stderr = io.StringIO()
  `);
  
  try {
    await pyodide.runPythonAsync(code);
    const stdout = pyodide.runPython("sys.stdout.getvalue()");
    const stderr = pyodide.runPython("sys.stderr.getvalue()");
    return { success: true, output: stdout, error: stderr };
  } catch (err) {
    return { success: false, output: '', error: err.message };
  }
}
```

### Matplotlib Support
Pyodide can render matplotlib plots to a canvas. After `plt.show()`, capture as base64:
```python
import matplotlib.pyplot as plt
import io, base64
fig = plt.gcf()
buf = io.BytesIO()
fig.savefig(buf, format='png', bbox_inches='tight', facecolor='#111827')
buf.seek(0)
img_base64 = base64.b64encode(buf.read()).decode()
print(f"__IMG__{img_base64}__IMG__")
```

Frontend detects `__IMG__` markers and renders as `<img>` tag.

### Pre-loaded Examples
The playground has a dropdown with starter code:

```javascript
const EXAMPLES = [
  {
    id: 'hello',
    title: 'Hello Python',
    code: `print("Hello from Elixa! 🧠")
print("Python is running in your browser via WebAssembly!")

for i in range(5):
    print(f"  Step {i+1}: Learning ML is fun!")`
  },
  {
    id: 'numpy-basics',
    title: 'NumPy Basics',
    code: `import numpy as np

# Create arrays
data = np.array([14, 23, 18, 25, 30, 19, 22, 27])
print(f"Data: {data}")
print(f"Mean: {np.mean(data):.2f}")
print(f"Std Dev: {np.std(data):.2f}")
print(f"Min: {np.min(data)}, Max: {np.max(data)}")

# Matrix operations
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
print(f"\\nMatrix A:\\n{A}")
print(f"Matrix B:\\n{B}")
print(f"A × B:\\n{A @ B}")`
  },
  {
    id: 'linear-regression',
    title: 'Linear Regression (sklearn)',
    code: `import numpy as np
from sklearn.linear_model import LinearRegression

# Dataset: Study hours vs exam score
hours = np.array([1, 2, 3, 4, 5, 6, 7, 8]).reshape(-1, 1)
scores = np.array([45, 50, 55, 62, 70, 75, 82, 88])

# Train model
model = LinearRegression()
model.fit(hours, scores)

print(f"Slope (weight): {model.coef_[0]:.2f}")
print(f"Intercept (bias): {model.intercept_:.2f}")
print(f"Equation: score = {model.coef_[0]:.2f} × hours + {model.intercept_:.2f}")
print()

# Predictions
for h in [3, 6, 10]:
    pred = model.predict([[h]])[0]
    print(f"  {h} hours of study → predicted score: {pred:.1f}")

print(f"\\nR² Score: {model.score(hours, scores):.4f}")`
  },
  {
    id: 'classification',
    title: 'Classification (sklearn)',
    code: `import numpy as np
from sklearn.tree import DecisionTreeClassifier
from sklearn.model_selection import train_test_split

# Dataset: [height(cm), weight(kg)] → sport
X = np.array([
    [180, 80], [175, 75], [190, 90], [185, 85],  # Basketball
    [165, 60], [170, 55], [160, 58], [168, 62],   # Gymnastics
    [175, 100], [180, 110], [185, 105], [178, 95]  # Wrestling
])
y = np.array([0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2])
labels = ['Basketball', 'Gymnastics', 'Wrestling']

# Split and train
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25)
clf = DecisionTreeClassifier()
clf.fit(X_train, y_train)

print(f"Accuracy: {clf.score(X_test, y_test) * 100:.0f}%")
print()

# Predict new athletes
new_athletes = [[182, 82], [162, 55], [180, 105]]
for athlete in new_athletes:
    pred = clf.predict([athlete])[0]
    print(f"  Height={athlete[0]}cm, Weight={athlete[1]}kg → {labels[pred]}")`
  },
  {
    id: 'pandas',
    title: 'Pandas Data Analysis',
    code: `import pandas as pd
import numpy as np

# Create a dataset
data = {
    'Student': ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'],
    'Math': [92, 78, 85, 96, 88, 73],
    'Science': [88, 82, 79, 94, 91, 68],
    'English': [95, 71, 88, 90, 85, 77]
}

df = pd.DataFrame(data)
df['Average'] = df[['Math', 'Science', 'English']].mean(axis=1)
df['Grade'] = df['Average'].apply(lambda x: 'A' if x >= 90 else 'B' if x >= 80 else 'C')

print("📊 Student Report Card")
print("=" * 50)
print(df.to_string(index=False))
print()
print(f"Class Average: {df['Average'].mean():.1f}")
print(f"Top Student: {df.loc[df['Average'].idxmax(), 'Student']}")
print(f"Grade Distribution:\\n{df['Grade'].value_counts().to_string()}")`
  }
];
```

---

## 2. Spam Detector Simulation (Real sklearn in Browser)

Page: `frontend/app/simulations/spam-detector/page.js`

### Dataset (hardcoded in component)
```javascript
const SPAM_DATASET = [
  { text: "Congratulations! You've won a $1000 gift card! Click here to claim!", label: 1 },
  { text: "Hey, are we still meeting for lunch tomorrow?", label: 0 },
  { text: "URGENT: Your account will be suspended. Verify now!", label: 1 },
  { text: "Can you review the pull request I sent yesterday?", label: 0 },
  { text: "FREE iPhone 15! Limited time offer. Act NOW!", label: 1 },
  { text: "The project deadline has been moved to next Friday", label: 0 },
  { text: "You've been selected as a winner! Send your details.", label: 1 },
  { text: "Don't forget to buy groceries on your way home", label: 0 },
  { text: "Make $5000 per week working from home! Click link!", label: 1 },
  { text: "Team standup is rescheduled to 10:30 AM", label: 0 },
  { text: "WINNING NOTIFICATION: Claim your prize money today!", label: 1 },
  { text: "Happy birthday! Hope you have a great day! 🎂", label: 0 },
  { text: "Lose weight fast! Buy our miracle supplement!", label: 1 },
  { text: "The quarterly report is ready for your review", label: 0 },
  { text: "Hot singles in your area want to meet you!", label: 1 },
  { text: "Movie tonight? I was thinking that new sci-fi film", label: 0 },
  { text: "Your loan has been approved! Low interest rate!", label: 1 },
  { text: "Please find attached the meeting notes from today", label: 0 },
  { text: "Get rich quick! Invest in crypto NOW for 500% returns!", label: 1 },
  { text: "Great job on the presentation today, really impressed!", label: 0 },
];
```

### Python Code (runs via Pyodide)
```python
TRAIN_CODE = `
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
import json

emails = json.loads('''EMAILS_JSON''')
texts = [e['text'] for e in emails]
labels = [e['label'] for e in emails]

vectorizer = CountVectorizer(stop_words='english')
X = vectorizer.fit_transform(texts)
X_train, X_test, y_train, y_test = train_test_split(X, labels, test_size=0.3, random_state=42)

model = MultinomialNB()
model.fit(X_train, y_train)
accuracy = model.score(X_test, y_test)

# Store in global scope for prediction
import builtins
builtins._spam_model = model
builtins._spam_vectorizer = vectorizer

print(json.dumps({"accuracy": round(accuracy * 100, 1)}))
`;

PREDICT_CODE = `
import json, builtins
import numpy as np

user_text = """USER_INPUT"""
X_new = builtins._spam_vectorizer.transform([user_text])
prediction = builtins._spam_model.predict(X_new)[0]
probability = builtins._spam_model.predict_proba(X_new)[0]

# Get top trigger words
feature_names = builtins._spam_vectorizer.get_feature_names_out()
word_probs = builtins._spam_model.feature_log_prob_[1]  # spam class
words_in_email = X_new.toarray()[0]
trigger_indices = (words_in_email > 0).nonzero()[0]
triggers = [feature_names[i] for i in trigger_indices]

print(json.dumps({
    "prediction": int(prediction),
    "confidence": round(max(probability) * 100, 1),
    "spamProb": round(probability[1] * 100, 1),
    "hamProb": round(probability[0] * 100, 1),
    "triggerWords": triggers[:5]
}))
`;
```

### UI Flow
1. Show dataset as a table (text, spam/ham badge)
2. "Train Model" button → runs TRAIN_CODE → shows accuracy
3. Text input for custom email
4. "Classify" button → runs PREDICT_CODE → shows result card:
   - 🚨 SPAM or ✅ NOT SPAM
   - Confidence bar
   - Trigger words highlighted

---

## 3. Image Classifier (Pre-computed / TensorFlow.js)

Page: `frontend/app/simulations/image-classifier/page.js`

### Approach: Pre-computed Results (Phase 3 fast version)

Use 8 sample images with pre-computed classification results. The UX simulates real ML inference without needing TF.js (which adds load time).

```javascript
const SAMPLE_IMAGES = [
  {
    id: 1,
    src: '/images/classifier/cat.jpg',      // Generated images
    actual: 'Cat',
    predictions: [
      { label: 'Cat', confidence: 89.2 },
      { label: 'Dog', confidence: 7.1 },
      { label: 'Rabbit', confidence: 2.3 },
      { label: 'Bird', confidence: 1.4 }
    ]
  },
  // ... 7 more images
];
```

### UI Flow
1. Grid of 8 images (2×4 on desktop, 1 col on mobile)
2. Click any image → "Analyzing..." spinner (500ms delay for realism) → prediction card
3. Prediction card: top label, confidence bar chart for all categories
4. Shows "How it works" expandable that explains CNNs briefly

### Enhancement (if time): Real TF.js
```javascript
import * as mobilenet from '@tensorflow-models/mobilenet';

const model = await mobilenet.load();
const img = document.getElementById('target-image');
const predictions = await model.classify(img);
```

---

## 4. Overfitting Challenge Game (Canvas + Real Math)

Page: `frontend/app/games/overfitting-challenge/page.js` (or rendered in `[gameId]/page.js`)

### Real polynomial fitting in JavaScript

```javascript
// Vandermonde matrix least squares
function polyFit(xArr, yArr, degree) {
  const n = xArr.length;
  const m = degree + 1;
  
  // Build Vandermonde matrix
  const X = [];
  for (let i = 0; i < n; i++) {
    const row = [];
    for (let j = 0; j < m; j++) {
      row.push(Math.pow(xArr[i], j));
    }
    X.push(row);
  }
  
  // Normal equations: (X^T X)^-1 X^T y
  // Use simplified Gaussian elimination for small matrices
  // Returns coefficients array
  return solveNormalEquations(X, yArr);
}

// Evaluate polynomial at point x
function polyEval(coeffs, x) {
  let result = 0;
  for (let i = 0; i < coeffs.length; i++) {
    result += coeffs[i] * Math.pow(x, i);
  }
  return result;
}

// Calculate MSE
function mse(yTrue, yPred) {
  const n = yTrue.length;
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += Math.pow(yTrue[i] - yPred[i], 2);
  }
  return sum / n;
}
```

### Data Generation
```javascript
// Generate noisy sine data
function generateData(n = 20) {
  const data = [];
  for (let i = 0; i < n; i++) {
    const x = (i / n) * 4 * Math.PI;
    const y = Math.sin(x) + (Math.random() - 0.5) * 0.5;
    data.push({ x, y });
  }
  
  // Split into train (70%) and test (30%)
  const shuffled = [...data].sort(() => Math.random() - 0.5);
  const splitIdx = Math.floor(n * 0.7);
  return {
    train: shuffled.slice(0, splitIdx),
    test: shuffled.slice(splitIdx)
  };
}
```

### Canvas Rendering
- Background: dark (`#111827`)
- Data points: train = cyan circles, test = pink circles
- Fitted curve: gradient from green (good fit) to red (overfit)
- Axes with labels
- Two accuracy gauges at top: "Train Accuracy" (green) and "Test Accuracy" (red)

### Game Logic
- Slider: Polynomial degree (1 → 12)
- As user adjusts:
  1. Fit polynomial to TRAIN data
  2. Calculate train MSE and test MSE
  3. Convert MSE to "accuracy" display: `accuracy = max(0, 100 - mse * 10)`
  4. Redraw curve on canvas
- Score = peak test accuracy achieved
- Visual: train accuracy always goes up, test accuracy peaks around degree 3-4 then drops — demonstrating overfitting

---

## 5. Neural Network Trainer Game (Canvas Animation)

### Visual Simulation (not real training)

**Canvas layout:**
```
[Input Layer] ─── [Hidden Layer 1] ─── [Output Layer]
    ○                  ○                    ○
    ○                  ○                    ○
    ○                  ○
```

**Controls:**
- Slider: Hidden neurons (2-8)
- Slider: Learning rate (0.001 - 1.0)
- Button: "Train"

**On "Train":**
1. Generate pre-computed loss curve based on settings:
   - Low LR: slow descent, arrives eventually
   - Medium LR: rapid descent, good convergence
   - High LR: oscillates, may diverge
   - More neurons: lower final loss, but slower
2. Animate:
   - Connection lines pulse and change thickness
   - Node colors shift from red (untrained) to green (trained)
   - Loss curve draws left-to-right
   - Accuracy counter increments: 50% → 65% → 78% → ... → final
3. Show final score

**Loss curve generation:**
```javascript
function generateLossCurve(lr, neurons, steps = 100) {
  const curve = [];
  let loss = 2.5; // Starting loss
  const target = 0.1 + (0.5 / neurons); // More neurons = lower final loss
  
  for (let i = 0; i < steps; i++) {
    const noise = (Math.random() - 0.5) * lr * 0.3;
    const decay = Math.exp(-i * lr * 0.05);
    loss = target + (loss - target) * (1 - lr * 0.1) + noise * decay;
    
    if (lr > 0.5 && Math.random() < 0.1) {
      loss += lr * 0.3; // Overshooting with high LR
    }
    
    loss = Math.max(target * 0.8, loss);
    curve.push(loss);
  }
  return curve;
}
```

---

## 6. Interactive Parameter Exercise (Lesson Embedded)

Appears inside Linear Regression lesson as an `interactive` section.

**Component**: `LinearRegressionSlider`

**UI:**
- Canvas: scatter plot with data points (fixed)
- Two sliders: Weight (w) range [-5, 5], Bias (b) range [-10, 10]
- Live line: `y = w*x + b` updates in real-time as sliders move
- MSE display: calculates real MSE against data points, updates live
- Goal text: "Adjust w and b to minimize the MSE!"
- Best MSE tracker: remembers lowest MSE achieved

```javascript
function drawLine(ctx, w, b, xRange) {
  ctx.beginPath();
  ctx.strokeStyle = '#3b82f6';
  ctx.lineWidth = 2;
  const x1 = xRange[0], x2 = xRange[1];
  const y1 = w * x1 + b;
  const y2 = w * x2 + b;
  ctx.moveTo(toCanvasX(x1), toCanvasY(y1));
  ctx.lineTo(toCanvasX(x2), toCanvasY(y2));
  ctx.stroke();
}
```
