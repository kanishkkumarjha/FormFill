require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();
const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
	app.use(express.static(path.resolve(__dirname, "client", "build")));
	res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
});

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Failed to connect to MongoDB', err));


const formSchema = new mongoose.Schema({
    name: String,
    dateOfBirth: Date,
    email: String,
    phoneNumber: String
});

const Form = mongoose.model('Form', formSchema);

app.post('/submit-form', async (req, res) => {
    const { name, dateOfBirth, email, phoneNumber } = req.body;

    // Validate phone number on the backend
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({ message: 'Invalid phone number' });
    }

    const form = new Form({ name, dateOfBirth, email, phoneNumber });
    await form.save();

    // Send email to the form submitter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Form Submission Successful',
        text: `Thank you, ${name}, for submitting the form!`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).json({ message: 'Failed to send email' });
        }
        res.status(200).json({ message: 'Form submitted successfully!' });
    });
});

app.get('/forms', async (req, res) => {
    const forms = await Form.find();
    res.status(200).json(forms);
});

// Serve static files from the React app
// if (process.env.NODE_ENV === 'production') {
//     app.use(express.static(path.join(__dirname, 'client/build')));
//     app.get('*', (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//     });
// }

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
