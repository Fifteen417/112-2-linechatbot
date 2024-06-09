require('dotenv').config();
const express = require('express');
const line = require('@line/bot-sdk');
const axios = require('axios');
const { QwenVLChat } = require('@qwen-chat/qwen-vl-chat');

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET
};

const client = new line.Client(config);
const app = express();

// 创建 Qwen-VL-Chat 实例
const qwen = new QwenVLChat();

app.post('/webhook', line.middleware(config), (req, res) => {
  Promise
    .all(req.body.events.map(handleEvent))
    .then(result => res.json(result))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
});

async function handleEvent(event) {
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
      // 使用 Qwen-VL-Chat 模型生成回复
      return callQwenForRecommendation(userMessage, event.replyToken);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: replyMessage
  });
}

// 调用 Qwen-VL-Chat 模型进行文本生成
async function callQwenForRecommendation(message, replyToken) {
  const response = await generateText(message);
  return client.replyMessage(replyToken, {
    type: 'text',
    text: response
  });
}

// 生成文本的函数
async function generateText(message) {
  try {
    const response = await qwen.chat(message);
    return response.text;
  } catch (error) {
    console.error('Error from Qwen-VL-Chat:', error);
    return '很抱歉，系统出现错误，请稍后再试';
  }
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at ${port}`);
});