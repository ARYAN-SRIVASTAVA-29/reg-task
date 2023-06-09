const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();


app.use(bodyParser.urlencoded({ extended: true }));


mongoose.connect('mongodb://0.0.0.0:27017/registration', { useNewUrlParser: true, useUnifiedTopology: true })


const registrationSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  mothersName: String,
  fathersName: String,
  address: String,
  gender: String,
  state: String,
  city: String,
  dob: String,
  pincode: String,
  course: String,
  email: String,
});


const Registration = mongoose.model('Registration', registrationSchema);


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});


app.get('/registration', (req, res) => {
  const success = req.query.success;
  if (success === 'true') {
    return res.redirect('/?success=true');
  }
  res.sendFile(__dirname + '/index.html');
});


app.get('/registrations', (req, res) => {
  Registration.find()
    .then(registrations => {
      res.json(registrations);
    })
    .catch(err => {
      console.error('Failed to retrieve registrations:', err);
      res.status(500).send('Internal Server Error');
    });
});


app.get('/registrations/:id', (req, res) => {
  const id = req.params.id;
  Registration.findById(id)
    .then(registration => {
      if (!registration) {
        return res.status(404).send('Registration not found');
      }
      res.json(registration);
    })
    .catch(err => {
      console.error('Failed to retrieve registration:', err);
      res.status(500).send('Internal Server Error');
    });
});


app.put('/registrations/:id', (req, res) => {
  const id = req.params.id;
  const formData = req.body;
  Registration.findByIdAndUpdate(id, formData, { new: true })
    .then(registration => {
      if (!registration) {
        return res.status(404).send('Registration not found');
      }
      res.json(registration);
    })
    .catch(err => {
      console.error('Failed to update registration:', err);
      res.status(500).send('Internal Server Error');
    });
});


app.delete('/registration/:id', (req, res) => {
  const id = req.params.id;
  Registration.findByIdAndDelete(id)
    .then(registration => {
      if (!registration) {
        return res.status(404).send('Registration not found');
      }
      res.json(registration);
      res.send("Deleted Succesfully")
    })
    .catch(err => {
      console.error('Failed to delete registration:', err);
      res.status(500).send('Internal Server Error');
    });
});

 
app.post('/registration', (req, res) => {
  const formData = req.body;


  const registration = new Registration(formData);


  registration.save()
    .then(() => {
  
      res.json({ success: true });
    })
    .catch(err => {
      console.error('Failed to save registration:', err);
      res.status(500).send('Internal Server Error');
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

