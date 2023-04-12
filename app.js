const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Підключення до MongoDB
mongoose.set('strictQuery', true).connect('mongodb://127.0.0.1/postsproject', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then((t) => {
    console.log("Connected to db ");
    console.log(t.Collection.name);
  }).catch(err => console.log('Error: ' + err))
    .then(() =>
      app.listen(PORT, () => {
        console.log('Server listening on port ' + PORT);
      }));

// Оголошення моделей даних
const User = mongoose.model('User', { name: String });
const Post = mongoose.model('Post', { title: String, content: String, userId: mongoose.Types.ObjectId });

app.use(bodyParser.json());


// Отримання списку користувачів
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Отримання деталей користувача за його ідентифікатором
app.get('/users/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  res.json(user);
});

// Створення нового користувача
app.post('/users', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json(user);
});

// Оновлення даних користувача за його ідентифікатором
app.put('/users/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(user);
});

// Видалення користувача за його ідентифікатором
app.delete('/users/:id', async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  res.json(user);
});


// Отримання списку постів
app.get('/posts', async (req, res) => {
  const posts = await Post.find().populate('userId', 'name');
  res.json(posts);
});

// Отримання деталей поста за його ідентифікатором
app.get('/posts/:id', async (req, res) => {
  const post = await Post.findById(req.params.id).populate('userId', 'name');
  res.json(post);
});

// Створення нового поста
app.post('/posts', async (req, res) => {
  const post = new Post(req.body);
  await post.save();
  res.json(post);
});

// Оновлення даних поста за його ідентифікатором
app.put('/posts/:id', async (req, res) => {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(post);
  });

  // Видалення користувача за його ідентифікатором
app.delete('/posts/:id', async (req, res) => {
    const post = await Post.findByIdAndDelete(req.params.id);
    res.json(post);
  });
