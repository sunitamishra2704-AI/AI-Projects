# Prompt Efficiency

Prompt Efficiency is a local-first VS Code extension that scores, analyzes, and improves AI prompts before you send them to GitHub Copilot, Cursor, Claude, or ChatGPT.

Every feature runs entirely on your machine. No data leaves VS Code. No cloud calls. No telemetry.

---

## Why Prompt Efficiency

When a prompt lacks context, the AI asks follow-up questions. Each clarification round costs time. Prompt Efficiency finds what is missing and suggests a better version before you send anything.

---

## How It Works

### Step 1 — Classify the prompt type

Prompt Efficiency reads your prompt and classifies it into one of eleven types:

| Type | Example |
|---|---|
| Bug Fix | "Fix this null exception in the activate method" |
| Unit Test | "Write NUnit tests for the active document" |
| Refactor | "Refactor this service to follow SOLID" |
| Code Review | "Review this pull request for edge cases" |
| Documentation | "Generate JSDoc for this module" |
| Summarization | "Summarize this document in 5 bullet points" |
| Translation | "Convert this Python script to TypeScript" |
| Project Creation | "Create a pantry inventory application" |
| Architecture | "Design a database schema for a blog" |
| General Question | "What is the difference between async and await?" |
| General | Everything else |

### Step 2 — Determine applicable rules

Each prompt type only requires a relevant subset of information. A summarization prompt does not need a programming language or error message. A bug fix prompt needs all of them.

| Rule | Bug Fix | Unit Test | Refactor | Code Review | Project Creation | Summarization | General Question |
|---|---|---|---|---|---|---|
| Task | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Language | ✓ | ✓ | ✓ | | ✓ | | |
| Framework | ✓ | ✓ | | | ✓ | | |
| Target platform | | | | | ✓ | | |
| Code snippet | ✓ | ✓ | ✓ | ✓ | | | |
| Error message | ✓ | | | | | | |
| Constraints | ✓ | | ✓ | | ✓ | | |
| Expected output | ✓ | | | | ✓ | ✓ | |

### Step 3 — Score against applicable rules only

The score is calculated as:

```
Score = (satisfied applicable rules) / (total applicable rules) × 100
```

This means "Summarize this document in 5 bullet points" scores **100/100** because it satisfies both applicable rules (task and output format). "Fix this bug" scores below 20/100 because a Bug Fix prompt requires code, error, language, constraints, and expected output — all missing.

Scoring bands:

| Grade | Score | Interpretation |
|---|---|---|
| A | 90–100 | Excellent |
| B | 70–89 | Good |
| C | 50–69 | Fair |
| D | 30–49 | Poor |
| F | 0–29 | Very Poor |

### Step 4 — Enrich from the active document (when applicable)

When you submit a prompt from the sidebar input, Prompt Efficiency reads the currently active VS Code editor file and automatically extracts:

- **Language** from the file extension (`.ts` → TypeScript, `.cs` → C#, `.py` → Python, etc.)
- **Class names** found in the file
- **Key method names** found in the file

This context is injected into the improved prompt so you get output like:

```
Programming language: TypeScript (detected from active document: extension.ts).
Code context: Active document is extension.ts (TypeScript).
  Classes: SidebarProvider, StatusBarProvider.
  Key methods: activate, analyzeAndPublish, resolveWebviewView.
```

If no code file is open, the extension falls back to asking you to specify the language manually.

### Step 5 — Generate the improved prompt

When a score falls below the configured threshold (default 70), Prompt Efficiency builds a structured version of your prompt that includes only the sections relevant to the detected type. Irrelevant sections (e.g., "error message" for a summarization task) are never added.

You can copy the improved prompt with one click and paste it into any AI assistant.

---

## Using the Extension

### 1. Open the sidebar

Click the **Prompt Efficiency** icon in the Activity Bar, or run:
`Prompt Efficiency: Open Sidebar` from the Command Palette (`Ctrl+Shift+P`).

### 2. Type or paste your prompt

Type your draft prompt into the **Prompt to analyze** text area in the sidebar.

### 3. Analyze

Click **Analyze Prompt**.

If you have a code file open in the editor, the extension automatically reads it for language, class, and method context.

### 4. Read the Analysis tab

- **Type**: the detected prompt category
- **Detected**: what was found (task, language, code, error, etc.)
- **Missing**: what is required for this type but absent
- **Not Required**: rules that do not apply to this prompt type

### 5. Read the Suggestions tab

- **Optimization**: shows the improved prompt and estimated score gain
- **Changes**: how many items were added or clarified
- **Follow-up Predictor**: how many follow-up questions the AI is likely to ask and why

### 6. Copy and send

Click **Copy Improved Prompt** to copy the structured version, then paste it into Copilot Chat, Cursor, Claude, or ChatGPT.

### 7. Read the History tab

Tracks prompts submitted in the current VS Code session:

- Total prompts
- Average score
- Common missing items across your prompts
- Recent prompt entries

Click **Clear History** to reset.

---

## Live Analysis

In addition to the sidebar input, Prompt Efficiency also analyzes the text of the currently active editor document in real time. The Status Bar at the bottom of VS Code updates automatically as you type:

`Prompt Efficiency: 74/100 (Grade B)`

This is useful when drafting prompts in a scratch file or markdown document.

---

## Privacy and Offline Behavior

All processing is local:

- No cloud services
- No network calls
- No prompt data uploaded anywhere
- No extension telemetry
- No GitHub API

Session history lives in memory only and is cleared when VS Code restarts.

---

## Settings

Configure under **Preferences → Settings → Prompt Efficiency**:

| Setting | Type | Default | Description |
|---|---|---|---|
| `promptEfficiency.enableLiveAnalysis` | boolean | `true` | Enable live analysis of the active editor |
| `promptEfficiency.enableOptimizer` | boolean | `true` | Generate improved prompt when score is below threshold |
| `promptEfficiency.enablePredictor` | boolean | `true` | Show follow-up question prediction |
| `promptEfficiency.optimizationThreshold` | number | `70` | Score below which optimization is triggered |
| `promptEfficiency.enableSessionHistory` | boolean | `true` | Track prompt history for the current session |

---

## Commands

| Command | Description |
|---|---|
| `Prompt Efficiency: Open Sidebar` | Open the Prompt Efficiency sidebar |
| `Prompt Efficiency: Clear Session History` | Clear all prompts from the current session history |

---

## Supported Languages (Active Document Detection)

When reading context from the active editor, Prompt Efficiency recognises these file types:

TypeScript, JavaScript, Python, C#, Java, Go, Rust, C++, Ruby, PHP, Swift, Kotlin

---

## Requirements

- VS Code 1.85.0 or later
- No other extensions required
- No internet connection required


## Project Structure

`src/`

- `analyzers/` prompt parsing and detection
- `services/` scoring, optimization, predictor, session history
- `ui/` status bar, sidebar provider, webview assets
- `interfaces/` service contracts
- `utilities/` shared helpers

`tests/`

- `unit/` service unit tests
- `fixtures/` reusable test data

## Development

### Prerequisites

- Node.js 18+
- VS Code 1.85+

### Install

```bash
npm install
```

### Build

```bash
npm run build
```

### Watch mode

```bash
npm run watch
```

### Lint

```bash
npm run lint
```

### Test

```bash
npm run test
```

### Package extension

```bash
npm run package
```

## Extension Workflow Summary

1. You type in the active editor.
2. Prompt Analyzer extracts signal and missing context.
3. Scoring Engine computes prompt score.
4. Optimizer runs if below threshold.
5. Predictor estimates likely follow-up questions.
6. Session history updates.
7. Status Bar and Sidebar refresh in real time.

## Testing Status

Current implementation includes unit coverage for:

- PromptAnalyzer
- ScoringEngine
- PromptOptimizer
- FollowUpPredictor
- SessionHistoryService

## License

MIT
