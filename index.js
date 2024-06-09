require('dotenv').config();
const express = require('express');
const line = require('@line/bot-sdk');
const axios = require('axios');
const { AutoTokenizer, AutoModelForCausalLM } = require('transformers'); // 引入 Transformers
const torch = require('torch'); // 引入 Torch

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

const client = new line.Client(config);
const app = express();

// 加载 OPT-125M 模型和 Tokenizer
const tokenizer = AutoTokenizer.from_pretrained("facebook/opt-125m");
const model = AutoModelForCausalLM.from_pretrained("facebook/opt-125m");

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then(result => res.json(result))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
});

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const userMessage = event.message.text.toLowerCase();

  // 判斷是否需要調用 Gemini API 的標誌
  let useGeminiAPI = true;
  let replyMessage = '';

  switch (true) {
    case userMessage.includes('你好'):
      replyMessage = '欢迎使用3C产品推荐助手！请问您需要什么样的帮助呢？';
      useGeminiAPI = false;
      break;
    case userMessage.includes('筆記本'):
      replyMessage = '好的，请告诉我您的具体需求，比如性能、价格范围、品牌偏好等。';
      useGeminiAPI = false;
      break;
    case userMessage.includes('轻薄'):
      replyMessage = '明白了，我会为您推荐符合这些要求的笔记本。';
      useGeminiAPI = false;
      break;
    case userMessage.includes('推荐'):
      // 当用户请求推荐时，调用 OPT-125M 模型
      return callOPTForRecommendation(userMessage, event.replyToken);
    case userMessage.includes('详细信息'):
      replyMessage = '这款笔记本的详细信息如下：[详细信息]。';
      useGeminiAPI = false;
      break;
    case userMessage.includes('比较'):
      replyMessage = '好的，请稍等，我会为您比较这两款产品的性能。';
      useGeminiAPI = false;
      break;
    case userMessage.includes('决定购买'):
      replyMessage = '不客气，祝您购物愉快！如果您还有其他问题或需要帮助，随时联系我。';
      useGeminiAPI = false;
      break;
    case userMessage.includes('评分'):
      replyMessage = '非常感谢！如果您愿意的话，您可以给我一个评分，以帮助我们改进服务。评分范围是1到5，1表示非常不满意，5表示非常满意。您愿意给我评分吗？';
      useGeminiAPI = false;
      break;
  }

  if (useGeminiAPI) {
    return callGeminiAPI(userMessage, event.replyToken);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: replyMessage
  });
}

// 调用 OPT-125M 模型进行文本生成
function callOPTForRecommendation(message, replyToken) {
  return generateText(model, tokenizer, message)
    .then(response => {
      // 处理 OPT-125M 生成的文本
      // 您可以根据需要添加逻辑，例如提取关键字、筛选结果等
      const generatedText = response[0]; 
      return client.replyMessage(replyToken, {
        type: 'text',
        text: generatedText
      });
    })
    .catch(error => {
      console.error('Error from OPT Model:', error);
      return client.replyMessage(replyToken, {
        type: 'text',
        text: '很抱歉，系统出现错误，请稍后再试'
      });
    });
}

// 生成文本的函数
function generateText(model, tokenizer, prompt, max_length=50, num_return_sequences=1) {
  const input_ids = tokenizer(prompt, return_tensors="pt").input_ids;
  const generated_ids = model.generate(
    input_ids,
    max_length=max_length,
    num_return_sequences=num_return_sequences,
    do_sample=true, // 使用采样生成多样化的文本
    temperature=0.7 // 设置温度参数来控制生成文本的随机性
  );
  const generated_text = tokenizer.batch_decode(generated_ids, skip_special_tokens=true);
  return generated_text;
}

// 调用 Gemini API 处理其他消息 (请注意，Gemini API 无法使用，此函数仅保留供参考)
function callGeminiAPI(message, replyToken) {
  // ... (Gemini API 的代码，目前无法使用)
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at ${port}`);
});