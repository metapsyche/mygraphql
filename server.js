// These lines make "require" available
import { createRequire } from "module";
const require = createRequire(import.meta.url);

var express = require('express');
var cors  = require('cors');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

import { issues }  from './data/issues.js';
 
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    getIssues: [ Issue ],
 }

  type Issue {
    title: String,
    number: String
  }

`);


const Issues = issues.issues;
 
console.log(Issues);


// The root provides a resolver function for each API endpoint
var root = {
  getIssues: () => Issues,
};
 
var app = express();
app.use(cors()); //enable CORS!

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');