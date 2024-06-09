require('dotenv').config();
const express = require('express');
const line = require('@line/bot-sdk');
const axios = require('axios');
const { AutoTokenizer, AutoModelForCausalLM } = require('transformers');
const torch = require('torch');

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

  // 处理用户输入
  let replyMessage = '';
  switch (true) {
    case userMessage.includes('你好'):
      replyMessage = '欢迎使用笔记本推荐助手！请问您想找什么样的笔记本呢？';
      break;
    case userMessage.includes('推荐'):
      replyMessage = '好的，请告诉我您的需求，例如：\n' +
                    '1.  预算范围：例如 5000 元以下，10000 元左右\n' +
                    '2.  用途：例如 游戏、办公、编程、学习\n' +
                    '3.  品牌偏好：例如  苹果、联想、华硕\n' +
                    '4.  其他需求：例如 轻薄、性能强大、屏幕尺寸、电池续航等';
      break;
    default:
      // 使用 OPT-125M 模型生成回复
      return callOPTForRecommendation(userMessage, event.replyToken);
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at ${port}`);
});