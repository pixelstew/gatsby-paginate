# Gatbsy-paginate

This library provides a simple API for paginating an array of posts/pages for your blog/site homepage in Gatsby js.

## Installation

```
npm install gatsby-paginate --save
```

## Usage

Oncce the package is installed you will need to require it in your `gatsby-node.js` file.

```
const createPaginatedPages = require('gatsby-paginate');
```

The function can then be used in your static build by passing in the response from your graphQL request as and array. In addition to this there are other configuration args.

```javascript
createPaginatedPages({
 edges, // Array fo posts
 createPage, // The gatsby createPage function from boundActionCreators
 pageTemplate, // The template file your pages will use
 pageLength // iNusmbuer of posts to group/navigate by
})
```

## Context ##

This implementation negates the need for a separate index.js page. Instead it creates a context of `first` as a bool which retyurns `true` if the pagination index is 0. This can be used to conditionally render content on yopur first/index paage.

It also passes the index of current pagination, and a boolean value for last page. 