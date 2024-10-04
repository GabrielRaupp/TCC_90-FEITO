import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const uri = process.env.MONGODB_URI || "mongodb+srv://Gabriel:qVeyehZk9ydz3eRZ@cluster0.imngu.mongodb.net/myDatabase?retryWrites=true&w=majority";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  writeConcern: { w: "majority", j: true }
})
  .then(() => console.log('Conectado ao MongoDB Atlas com sucesso!'))
  .catch((error) => console.error('Erro ao conectar ao MongoDB:', error));

const HorarioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  horarios: { type: String, required: true },
  category: { type: String, required: true },
});

const Horario = mongoose.model('Horario', HorarioSchema);

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String },
  email: { type: String, required: true, unique: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date
});

const User = mongoose.model('User', userSchema);

// Rota para obter todos os horários
app.get('/horarios', async (req, res) => {
  try {
    const horarios = await Horario.find();
    const currentDate = new Date();

    const expiredHorarios = horarios.filter(horario => {
      const horarioDate = new Date(horario.horarios);
      return horarioDate < currentDate;
    });

    for (const expired of expiredHorarios) {
      await Horario.findByIdAndDelete(expired._id);
    }

    const validHorarios = await Horario.find();
    res.json(validHorarios);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para obter um horário específico
app.get('/horarios/:id', async (req, res) => {
  try {
    const horario = await Horario.findById(req.params.id);
    if (!horario) {
      return res.status(404).json({ message: 'Horário não encontrado' });
    }
    res.json(horario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para cadastrar um novo horário
app.post('/horarios', async (req, res) => {
  try {
    const { name, horarios, category } = req.body;
    if (!name || !horarios || !category) {
      throw new Error('Campos obrigatórios não preenchidos');
    }
    const horario = new Horario({
      name,
      horarios,
      category,
    });
    const newHorario = await horario.save();
    res.status(201).json(newHorario);
  } catch (error) {
    console.error(error);
    res.status(400).json({ message: error.message });
  }
});

// Rota para atualizar um horário existente
app.put('/horarios/:id', async (req, res) => {
  try {
    const updatedHorario = await Horario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedHorario) {
      return res.status(404).json({ message: 'Horário não encontrado' });
    }
    res.json(updatedHorario);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Rota para deletar um horário
app.delete('/horarios/:id', async (req, res) => {
  try {
    const horario = await Horario.findByIdAndDelete(req.params.id);
    if (!horario) {
      return res.status(404).json({ message: 'Horário não encontrado' });
    }
    res.json({ message: 'Horário removido com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Configuração do Nodemailer para envio de e-mails
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Você pode usar outro serviço de e-mail
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Rota para cadastrar um novo usuário
app.post('/cadastro', async (req, res) => {
  try {
    const { username, password, name, email } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Nome de usuário já existe!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, name, email });
    await user.save();
    res.json({ message: 'Usuário criado com sucesso!' });
  } catch (error) {
    res.status(400).json({ message: error.message });
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

    // Removido o uso do JWT
    res.json({ message: 'Usuário logado com sucesso!' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Rota para solicitar redefinição de senha
app.post('/ForgotPassword', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ message: 'Se o e-mail fornecido estiver cadastrado, você receberá um e-mail com instruções para redefinir sua senha.' });
  }

  const token = crypto.randomBytes(20).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
  await user.save();

  const resetUrl = `http://localhost:${PORT}/resetar-senha/${token}`;

  await transporter.sendMail({
    to: user.email,
    subject: 'Redefinição de Senha',
    text: `Você está recebendo este e-mail porque recebemos uma solicitação para redefinir a senha da sua conta.\n\n` +
          `Clique no link a seguir para redefinir sua senha:\n\n` +
          `${resetUrl}\n\n` +
          `Se você não solicitou a redefinição de senha, ignore este e-mail.\n`,
  });

  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({ message: 'Se o e-mail fornecido estiver cadastrado, você receberá um e-mail com instruções para redefinir sua senha.' });
});

// Rota para redefinir a senha
app.post('/resetar-senha/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token inválido ou expirado' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    
    res.status(200).json({ message: 'Senha redefinida com sucesso!' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao redefinir a senha', error });
  }
});

// Captura arquivos estáticos
app.use(express.static(path.join(__dirname, 'build')));

// Captura qualquer requisição não tratada
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Middleware de erro
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
