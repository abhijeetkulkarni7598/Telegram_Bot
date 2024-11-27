const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/User');
const BotSetting = require('./models/BotSetting');

const app = express();
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://abhijeetkulkarni117:abhi123@cluster0.y2jzzdp.mongodb.net/Telegram_Bot?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

// Route to update bot settings
app.post('/api/settings', async (req, res) => {
  const { apiKey } = req.body;

  let settings = await BotSetting.findOne();
  if (settings) {
    settings.apiKey = apiKey;
    await settings.save();
  } else {
    await BotSetting.create({ apiKey });
  }

  res.send({ message: 'Bot settings updated.' });
});

// Route to get all users
app.get('/api/users', async (req, res) => {
  const users = await User.find();
  res.send(users);
});

// Route to block a user
app.post('/api/users/block', async (req, res) => {
  const { chatId } = req.body;
  await User.findOneAndUpdate({ chatId }, { blocked: true });
  res.send({ message: 'User blocked.' });
});

// Route to delete a user
app.delete('/api/users/:chatId', async (req, res) => {
  const { chatId } = req.params;
  await User.findOneAndDelete({ chatId });
  res.send({ message: 'User deleted.' });
});

// Start the admin panel server
app.listen(5000, () => {
  console.log('Admin panel running on http://localhost:5000');
});
