const default_settings = require('./default_settings');

const express = require('express');
const app = express();

require('./routes/index')(app);
app.listen(default_settings.server.port, ()=>{
    console.log("Starting server on port " + default_settings.server.port);
});
