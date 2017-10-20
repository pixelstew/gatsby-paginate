# Gatbsy-paginate

This library provides a simple API for paginating an array of posts/pages for your blog/site homepage in Gatsby js.

## Installation

```
npm install gatsby-paginate --save
```

## Usage

One the package is installed you will need to require it in your `gatsby-node.js` file.

```
const createPaginatedPages = require('gatsby-paginate');
```

The function can then be used in your static build by passing in the response from your graphQL request for content as and array aswell as a few other args.

```javascript
createPaginatedPages({
 edges, // Array fo posts
 createPage, // The gatsby createPage function from boundActionCreators
 pageTemplate, // The template file your pages will use
 pageLength // Number of posts to group/paginate by
})
```