
// load the Cloudant library
var async = require('async'),
  Cloudant = require('cloudant'),
  cloudant = Cloudant({account: 'xxxxxx-xxxx-xxxx-xxxx-xxxxxx-bluemix', password: 'xxxxxx' }),
  dbname = 'test_stock',
  db = null,
  doc = null;


// create a database
var createDatabase = function(callback) {
  console.log("Creating database '" + dbname  + "'");
  cloudant.db.create(dbname, function(err, data) {
    if(err) console.log("Error:", err);
    console.log("Data:", data);
    db = cloudant.db.use(dbname);
    callback(err, data);
  });
};

// create a document
var createDocument = function(callback) {
  console.log(" ");
  console.log("Creating document 'mydoc'");
  // we are specifying the id of the document so we can update and delete it later
  db.insert({ _id: "mydoc", a:1, b: "two"}, function(err, data) {
    if(err) console.log("Error:", err);
    console.log("Data:", data);
    callback(err, data);
  });
};

// read a document
var readDocument = function(callback) {
  console.log(" ");
  console.log("Reading document 'mydoc'");
  db.get("mydoc", function(err, data) {
    if(err) console.log("Error:", err);
    console.log("Data:", data);
    // keep a copy of the doc so we know its revision token
    doc = data;
    callback(err, data);
  });
};

// update a document
var updateDocument = function(callback) {
  console.log(" ");
  console.log("Updating document 'mydoc':");
  console.log("BEFORE data: ", doc);
  // make a change to the document, using the copy we kept from reading it back
  doc.c = true;
  doc.d = {
    'foo': 'bar'
  }
  console.log("AFTER data: ", doc);
  db.insert(doc, function(err, data) {
    if(err) console.log("Error:", err);
    console.log("Data:", data);
    // keep the revision of the update so we can delete it
    doc._rev = data.rev;
    callback(err, data);
  });
};

// deleting a document
var deleteDocument = function(callback) {
  console.log(" ");
  console.log("Deleting document 'mydoc' :");
  console.log(doc);
  // supply the id and revision to be deleted
  db.destroy(doc._id, doc._rev, function(err, data) {
    if(err) console.log("Error:", err);
    console.log("Data:", data);
    callback(err, data);
  });
};

// deleting the database document
/*var deleteDatabase = function(callback) {
  console.log("Creating database '" + dbname  + "'");
  cloudant.db.destroy(dbname, function(err, data) {
    if(err) console.log("Error:", err);
    console.log("Data:", data);
    callback(err, data);
  });
};*/
var deleteDatabase = function(callback) {
  console.log("Deleting database '" + dbname  + "'");
  callback(err, data);
};
// async.series([createDatabase, createDocument, readDocument, updateDocument, deleteDocument, deleteDatabase ]);
async.series([createDocument, readDocument, updateDocument, deleteDocument]);