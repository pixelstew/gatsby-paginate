# Gatsby-paginate

This library provides a simple API for paginating an array of posts/pages for your blog/site homepage in Gatsby js.

## Installation

```
npm install gatsby-paginate --save
```

## Usage

Once the package is installed you will need to require it in your `gatsby-node.js` file.

```javascript
const createPaginatedPages = require('gatsby-paginate');
```

The function can then be used in your static build by passing in the response from your graphQL request as an array.

```javascript
createPaginatedPages({ 
  edges:  // An array of posts/edges, 
  createPage, // The gatsby createPage function from boundActionCreators
  pageTemplate, // The template file your pages will use 
  pageLength // Optional number of posts to group/paginate by - default is 10
  })
```

## Context ##

This implementation negates the need for a separate `index.js` page. Instead it creates a context of `first` as a bool which returns `true` if the pagination index is 0. This can be used to conditionally render content on your first/index page inside the template specified as `pageTemplate`.

It also passes the index of current pagination, and a boolean value for last page. 

A basic example of using context for conditionally rendering content on your index page would be like so...

```javascript
const { group, index, first, last } = pathContext;
return (
  <div>
    {first ? (
      <h1>This is an h1 for my homepage</h1>
    ) : (
      <h1>This is an h1 for subsequent pages</h1>
    )}
  </div>     
```