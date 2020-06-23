const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((db) => console.log('DB connected'))
  .catch((err) => console.error('no esta cargando como es'));
