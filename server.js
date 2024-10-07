import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import session from 'express-session';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(session({
  secret: '01102005Br@',
  resave: false,
  saveUninitialized: true,
}));

const uri = process.env.MONGODB_URI || "mongodb+srv://Gabriel:qVeyehZk9ydz3eRZ@cluster0.imngu.mongodb.net/myDatabase?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  writeConcern: { w: "majority", j: true }
})
  .then(() => console.log('Conectado ao MongoDB Atlas com sucesso!'))
  .catch((error) => console.error('Erro ao conectar ao MongoDB:', error));

// Esquema de Horário
const HorarioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  horarios: { type: String, required: true },
  category: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

const Horario = mongoose.model('Horario', HorarioSchema);

// Esquema de Usuário
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  telefone: { type: String },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});


// Rota para excluir um horário
app.delete('/horarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedHorario = await Horario.findByIdAndDelete(id);

    if (!deletedHorario) {
      return res.status(404).json({ message: 'Horário não encontrado' });
    }

    res.json({ message: 'Horário excluído com sucesso!' });
  } catch (error) {
    console.error('Erro ao excluir horário:', error);
    res.status(500).json({ message: error.message });
  }
});

// Rota para obter um horário específico pelo ID
app.get('/horarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const horario = await Horario.findById(id);

    if (!horario) {
      return res.status(404).json({ message: 'Horário não encontrado' });
    }

    res.json(horario);
  } catch (error) {
    console.error('Erro ao obter horário:', error);
    res.status(500).json({ message: error.message });
  }
});

// Rota para atualizar um horário
app.put('/horarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, horarios, category } = req.body;

    if (!name || !horarios || !category) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const updatedHorario = await Horario.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedHorario) {
      return res.status(404).json({ message: 'Horário não encontrado.' });
    }

    res.json(updatedHorario);
  } catch (error) {
    console.error('Erro ao atualizar horário:', error);
    res.status(500).json({ message: error.message });
  }
});
const User = mongoose.model('User', userSchema);

// Rota para registrar
app.post('/register', async (req, res) => {
  try {
    const { username, password, email, telefone } = req.body;

    if (!username || !password || !email || !telefone) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email, telefone });
    await newUser.save();

    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: error.message });
  }
});

// Rota para login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Senha inválida' });
    }

    req.session.userId = user._id;
    console.log(`Usuário logado: ${user.username}, ID: ${req.session.userId}`);
    res.json({ message: 'Usuário logado com sucesso!' });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(400).json({ message: error.message });
  }
});

// Rota para logout
app.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao fazer logout' });
    }
    res.json({ message: 'Usuário deslogado com sucesso!' });
  });
});

// Rota para solicitar a redefinição de senha
app.post('/forgotpassword', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email é obrigatório.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: 'sua_senha_de_aplicativo_aqui', 
      },
    });

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: 'Redefinição de senha',
      text: `Você está recebendo este email porque você solicitou a redefinição da sua senha.\n\n` +
            `Clique no seguinte link para redefinir sua senha:\n\n` +
            `http://localhost:${PORT}/reset/${token}\n\n` +
            `Se você não solicitou isso, ignore este email.\n`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email enviado para ${email} com link de redefinição de senha.`); 
    res.json({ message: 'Um link para redefinição de senha foi enviado para seu email.' });
  } catch (error) {
    console.error('Erro ao solicitar redefinição de senha:', error); 
    res.status(500).json({ message: 'Erro interno do servidor. Tente novamente mais tarde.' });
  }
});

// Rota para redefinir a senha
app.post('/resetarSenha/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token de redefinição de senha inválido ou expirado.' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Senha redefinida com sucesso!' });
  } catch (error) {
    console.error('Erro ao redefinir a senha:', error);
    res.status(500).json({ message: error.message });
  }
});

// Rota para obter todos os horários do usuário
app.get('/horarios', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Você precisa estar logado para acessar os horários.' });
    }

    const horarios = await Horario.find({ user: req.session.userId });
    const currentDate = new Date();

    const expiredHorarios = horarios.filter(horario => new Date(horario.horarios) < currentDate);
    await Horario.deleteMany({ _id: { $in: expiredHorarios.map(h => h._id) } });

    const validHorarios = await Horario.find({ user: req.session.userId });
    res.json(validHorarios);
  } catch (error) {
    console.error('Erro ao obter horários:', error);
    res.status(500).json({ message: error.message });
  }
});

// Rota para registrar um novo horário
app.post('/horarios', async (req, res) => {
  try {
    console.log('Requisição para registrar um novo horário');
    console.log('Corpo da requisição:', req.body);

    const { name, horarios, category } = req.body;

    if (!name || !horarios || !category) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    console.log('ID do usuário:', req.session.userId);

    const newHorario = new Horario({
      name,
      horarios,
      category,
      user: req.session.userId 
    });

    console.log('Novo horário:', newHorario);

    await newHorario.save();
    res.status(201).json(newHorario);
  } catch (error) {
    console.error('Erro ao criar horário:', error);
    res.status(500).json({ message: error.message });
  }
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo deu errado!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
