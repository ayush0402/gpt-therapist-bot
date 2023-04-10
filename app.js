const express = require("express");
require("dotenv").config();
const { Configuration, OpenAIApi } = require("openai");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/analyze-sentiment", async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a mental therapist bot, you are supposed to help people feel better and help them with their psychological issues. ",
        },
        { role: "user", content: `${prompt}` },
        {
          role: "assistant",
          content:
            "Provide insights based on the given prompt to help the user overcome their issues.",
        },
      ],
      max_tokens: 64,
      temperature: 0,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: ["\n"],
    });

    return res.status(200).json({
      success: true,
      data: response.data.choices[0].message.content,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.response
        ? error.response.data
        : "There was an issue on the server",
    });
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server listening on port ${port}`));
