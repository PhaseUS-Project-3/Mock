const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/MockAuthorization',{ useNewUrlParser : true, useUnifiedTopology: true })
.then((   ) => console.log('connected MongDB'),
      (err) => console.log(err))

mongoose.set('useCreateIndex', true);