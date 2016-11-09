var fs = require('fs');
var path = require('path');
var express = require('express');
var Handlebars = require('handlebars');
var people = require('./people');
var app = express();
var port = process.env.PORT || 3000;

// Read the source of the person page template and compile it with Handlebars.
var personPageSource = fs.readFileSync(path.join(__dirname, 'templates', 'person-page.html'), 'utf8');
var personPageTemplate = Handlebars.compile(personPageSource);

// Read the source of the people page template and compile it with Handlebars.
var peoplePageSource = fs.readFileSync(path.join(__dirname, 'templates', 'people-page.html'), 'utf8');
var peoplePageTemplate = Handlebars.compile(peoplePageSource);

// Serve static files from public/.
app.use(express.static(path.join(__dirname, 'public')));

/*
 * For the /people route, we dynamically build the content of the page using
 * the set of all available people.  We let our Handlebars template do the
 * work, by simply passing the relevant data into the template.
 */
app.get('/people', function (req, res) {

  var content = peoplePageTemplate({people: people});
  res.send(content);

});

/*
 * Here, we use a dynamic route to create a page for each person.  We use
 * Express machinery to get the requested person from the URL and then fill
 * in a template with that person's info using Handlebars.
 */
app.get('/people/:person', function (req, res, next) {

  var person = people[req.params.person];

  if (person) {

    var content = personPageTemplate(person);
    res.send(content);

  } else {

    // If we don't have info for the requested person, fall through to a 404.
    next();

  }

});

// If we didn't find the requested resource, send a 404 error.
app.get('*', function(req, res) {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Listen on the specified port.
app.listen(port, function () {
  console.log("== Listening on port", port);
});
