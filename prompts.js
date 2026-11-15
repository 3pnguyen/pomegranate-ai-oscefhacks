const TF_PROMPTS = [
// English prompts for Pomegranate AI extension
  { 
    "id": "eng_grammar_fix", 
    "cat": "English", 
    "label": "Fix my grammar",
    "text": "Review the provided text for grammatical, punctuation, and spelling errors. First, list exactly what you'd fix and explain the grammar rule behind each correction so I can learn from my mistakes. Second, provide the corrected version."
  },
  { 
    "id": "eng_decode", 
    "cat": "English", 
    "label": "Decode the writing",
    "text": "Analyze the provided text to uncover its hidden layers and implicit meanings. Look beneath the literal surface and explain what the author or character is actually trying to convey. Identify any subtle cues, underlying themes, unstated motivations, or figurative language that reveal this deeper message. Break down how these elements work together to imply something that isn't directly stated." 
  },
  { 
    "id": "eng_writers_block", 
    "cat": "English", 
    "label": "Help me brainstorm",
    "text": "I am stuck and don't know how to start writing about this prompt or topic. Do not write the essay for me. Instead, give me 3 distinct angles or thesis ideas I could explore, and provide a bulleted outline for one of them to get my momentum going." 
  },
// Math prompts for Pomegranate AI extension
  {
    "id": "math_explain",
    "cat": "Math",
    "label": "Explain this math problem",
    "text": "Deconstruct this math problem and walk me through the solution step by step. Do not just provide the final answer. Instead, explain the initial setup, identify what we are trying to solve for, and clearly detail the mathematical operations and logic applied at every single stage. Make sure the transition between each step is clear so I can learn how to solve similar problems on my own."
  },
  { 
    "id": "math_hint", 
    "cat": "Math", 
    "label": "Give me a hint",
    "text": "I am stuck, but I want to solve this myself. Give me a single guiding hint. Point me toward the right formula, the first logical step, or a similar concept I should think about, but do not solve any part of the problem for me." 
  },
// Science prompts for Pomegranate AI extension
  { 
    "id": "sci_explain_process", 
    "cat": "Science", 
    "label": "Explain how this works",
    "text": "Break down this scientific process, mechanism, or law. Explain it chronologically or logically, detailing exactly how we get from cause to effect. Focus on clarity and the physical reality of what is happening, rather than just reciting textbook definitions." 
  },
  { 
    "id": "sci_analogy", 
    "cat": "Science", 
    "label": "Explain with an analogy",
    "text": "Translate this abstract scientific concept into a relatable, everyday analogy. Compare the components of this scientific system to something I already understand (like a machine, a city, or a recipe) and map the scientific parts directly to the parts of your analogy." 
  },
  { 
    "id": "sci_jargon", 
    "cat": "Science", 
    "label": "Translate the jargon",
    "text": "Rewrite this dense scientific text in plain, conversational English. After explaining the core concept simply, extract the 3-5 most important scientific terms used in the topic and provide a simple, one-sentence definition for each." 
  },
// General, universal prompts for Pomegranate AI extension
  {
    "id": "gen_summarize", 
    "cat": "General", 
    "label": "Summarize this",
    "text": "Provide a concise summary of the highlighted text. Break it down into a single-sentence core takeaway, followed by 3-5 bullet points covering the most essential arguments, facts, or details. Strip away the fluff and focus on the absolute main ideas." 
  },
  {
    "id": "gen_explain",
    "cat": "General",
    "label": "Explain",
    "text": "Explain the topic at the level you believe the topic is meant to be learned at. For example, DNA replication should be explained at the high school level, whereas things such as the quadratic formula can be explained at the middle school level."
  },
  { 
    "id": "gen_simplify", 
    "cat": "General", 
    "label": "Explain like I'm 5",
    "text": "Simplify this concept as if you are explaining it to a complete beginner. Use basic vocabulary, remove all unnecessary jargon, and make the core idea as intuitive and easy to grasp as possible." 
  },
  { 
    "id": "gen_quiz", 
    "cat": "General", 
    "label": "Quiz me on this",
    "text": "Test my understanding of this material. Ask me 3 challenging questions based on this topic, but ask them one at a time. Wait for my answer after each question before providing feedback, correcting any mistakes, and asking the next one." 
  },
  { 
    "id": "gen_feedback", 
    "cat": "General", 
    "label": "Give me feedback",
    "text": "Review my work and provide constructive feedback. Tell me what I did well, identify any weak points or logical gaps, and give me 2-3 specific, actionable suggestions on how I can improve this before submitting it." 
  },
// Diagram prompts for Pomegranate AI extension
  { 
    "id": "i-diagram",
    "cat": "Diagram",
    "label": "Draw me a diagram",
    "text": "Create a clear diagram that illustrates the highlighted text." 
  },
  {
    "id": "i-explain",
    "cat": "Diagram",
    "label": "Explain this diagram",
    "text": "Explain what this diagram or figure shows. Start with the big picture, then the parts and how they relate."
  },
  {
    "id": "i-walk",
    "cat": "Diagram",
    "label": "Walk through it step by step",
    "text": "Walk through this diagram step by step in the order a learner should read it."
  },
  {
    "id": "i-chart",
    "cat": "Diagram",
    "label": "What does this chart say?",
    "text": "Describe what this chart or graph shows: axes, trends, and the main takeaway. Note anything that could be misleading."
  }
];

// Curated follow-ups. Free typing is intentionally not offered (except the attempt box).
const TF_FOLLOWUPS = [
  { 
    id: "f-practice", 
    label: "Practice question", 
    text: "Give me one practice question on this. Do NOT reveal the answer." 
  },
  { 
    id: "f-hint", 
    label: "Hint only", 
    text: "Give me a hint for the last question, without giving away the answer." 
  },
  { 
    id: "f-simpler", 
    label: "Simpler", 
    text: "Explain that again more simply." 
  },
  { 
    id: "f-analogy", 
    label: "Analogy", 
    text: "Give me a different analogy for this." 
  },
  { 
    id: "f-diagram", 
    label: "Diagram", 
    text: "Create a clear diagram that illustrates this." 
  },
  { 
    id: "f-misc", 
    label: "Misconceptions", 
    text: "What mistakes do learners commonly make with this?" 
  },
  { 
    id: "f-quiz", 
    label: "Quiz me", 
    text: "Write 3 short questions to test my understanding of this. Do NOT include answers." 
  },
  { 
    id: "f-reveal", 
    label: "Show answer", 
    text: "Now show the answer to the last question with a short explanation." 
  },
];