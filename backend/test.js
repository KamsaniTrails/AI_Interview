require("dotenv").config();

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

async function test() {

  try {

    const completion =
      await openai.chat.completions.create({

        model: "openai/gpt-3.5-turbo",

        messages: [
          {
            role: "user",
            content: "hello",
          },
        ],
      });

    console.log(
      completion.choices[0].message.content
    );

  } catch (err) {

    console.log("FULL ERROR:");
    console.log(err);
  }
}

test();