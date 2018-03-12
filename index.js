const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const bodyParser = require('body-parser');
const express = require('express');
const path = require('path');
const fs = require('fs');

// setup route middlewares
const csrfProtection = csrf({ cookie: true });
const parseForm = bodyParser.urlencoded({ extended: false });

// create express app
const app = express();

// parse cookies
// we need this because "cookie" is true in csrfProtection
app.use(cookieParser());

// Rendering a page with CSRF token
app.get('/form', csrfProtection, function(req, res) {
  // pass the csrfToken to the view
  const data = fs.readFileSync(path.join(__dirname, 'index.html'), {
    encoding: 'utf-8'
  });
  if (data) {
    let csrfToken = null;

    // OK
    csrfToken = req.csrfToken();
    // Not OK
    // csrfToken = '';

    res.send(data.replace('{{csrfToken}}', csrfToken));
  }
});

// Processing POST requests with CSRF token validation
app.post('/process', parseForm, csrfProtection, function(req, res) {
  res.send('data is being processed');
});

app.listen(3000);
