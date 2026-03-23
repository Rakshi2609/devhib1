## Multi-Agent AI System (Powered by Featherless AI)

WebCraft AI now uses a sophisticated **5-agent orchestration pipeline** to ensure every generated site is premium and context-aware.

### The Agent Collective
1.  **Monitor Agent**: The orchestrator. Manages the state machine and logs every step.
2.  **Memory Agent**: Retrieves your past interactions from MongoDB to provide continuity across generations.
3.  **Generator Agent**: The design engine. Specialized in modern, "premium navy" aesthetics using **Llama 3.3 70B**.
4.  **Evaluator Agent**: The critic. Scores every draft on a scale of 1-10 for visual quality and technical accuracy.
5.  **Refiner Agent**: The polisher. Re-works the layout based on the Evaluator's critique to reach a 10/10 score.

### Tech Stack
-   **Model**: `meta-llama/Llama-3.3-70B-Instruct`
-   **Inference**: [Featherless.ai](https://featherless.ai)
-   **Storage**: MongoDB (Conversation Memory)
