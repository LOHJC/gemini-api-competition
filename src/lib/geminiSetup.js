const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.REACT_APP_GEMINI_API;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  
  const generationConfig = {
    temperature: 1.25,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig
  });

  export {model}