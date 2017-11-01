# Gatsby-paginate

This library provides a simple API for paginating an array of posts/pages for your blog/site homepage in Gatsby js.

## Installation

```
npm install gatsby-paginate --save
```

## Usage

To create a paginated index of your blog posts, you need to do four things:

1. Require the package in your `gatsby-node.js` file.
1. Add a call to createPaginatedPages in `gatsby-node.js`.
1. Remove the `index.js` file from the pages directory.
1. Create an `index.js` file in the templates directory and refer to it in the createPaginatedPages call

### Require the package
Add the following to the top of your `gatsby-node.js` file.

```javascript
const createPaginatedPages = require('gatsby-paginate');
```
### Call createPaginatedPages

You probably already have something like this in your `gatsby-node.js` file to generate the pages for your blog:

```javascript
exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;
  return new Promise((resolve, reject) => {
    graphql(`
      {
        posts: allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
        ) {
          edges {
            node {
              id
              frontmatter {
                title
              }
              fields {
                slug
              }
            }
          }
        }
      }
    `).then(result => {
      result.data.posts.edges.map(({ node }) => {
        createPage({
          path: node.fields.slug,
          component: path.resolve("./src/templates/post.js"),
          context: {
            slug: node.fields.slug
          }
        });
      });
      resolve();
    });
  });
};
```

Just insert a call to `createPaginatedPages` before (or after) the createPage function:

```javascript
exports.createPages = ({ graphql, boundActionCreators }) => {
  const { createPage } = boundActionCreators;
  return new Promise((resolve, reject) => {
    graphql(`
      //graphql query
    `).then(result => {
      createPaginatedPages({
        edges: result.data.posts.edges,
        createPage: createPage,
        pageTemplate: "src/templates/index.js",
        pageLength: 10
      });
      result.data.posts.edges.map(({ node }) => {
        createPage({
          path: node.fields.slug,
          component: path.resolve("./src/templates/post.js"),
          context: {
            slug: node.fields.slug
          }
        });
      });
      resolve();
    });
  });
};
```

Notice that `createPaginatedPages` is being passed an object. `edges` is the array of nodes that comes from the GraphQL query. `createPage` is simply the createPage function you get from `boundActionCreators`. `pageTemplate` is a template to use for the index page. And `pageLength` is an optional parameter that defines how many posts to show per index page. It defaults to 10. 

`createPaginatedPages` will then call `createPage` to create an index page for each of the groups of pages. The content that describes the blogs (title, slug, etc) that will go in each page will be passed to the template through `props.pathContext` so you need to make sure that everything that you want on the index page regarding the blogs should be requested in the GraphQL query in `gatsby-node.js`.

### Create the index template

After deleting `index.js` from the pages directory, create an `index.js` file in templates. Add something like the following code to your template:

```javascript
import React, { Component } from "react";
import Link from "gatsby-link";

const NavLink = props => {
  if (!props.test) {
    return <Link to={props.url}>{props.text}</Link>;
  } else {
    return <span>{props.text}</span>;
  }
};

const IndexPage = ({ data, pathContext }) => {
  const { group, index, first, last } = pathContext;
  const previousUrl = index - 1 == 1 ? "" : (index - 1).toString();
  const nextUrl = (index + 1).toString();

  return (
    <div>
      <h4>{data.allMarkdownRemark.totalCount} Posts</h4>

      {group.map(({ node }) => (
        <div key={node.id} className="blogListing">
          <div className="date">{node.frontmatter.date}</div>
          <Link className="blogUrl" to={node.fields.slug}>
            {node.frontmatter.title}
          </Link>
          <div>{node.excerpt}</div>
        </div>
      ))}
      <div className="previousLink">
        <NavLink test={first} url={previousUrl} text="Go to Previous Page" />
      </div>
      <div className="nextLink">
        <NavLink test={last} url={nextUrl} text="Go to Next Page" />
      </div>
    </div>
  );
};
export default IndexPage;

export const pageQuery = graphql`
  query IndexQuery {
    allMarkdownRemark {
      totalCount
    }
  }
`;
```

Notice that the posts for this page are in an array passed to the template through `this.props.pathContext.group`. Index shows the current page you are on, first is whether this is the first page, last is whether this is the last page. 

The query included is just to get info on the total number of posts on the site. 
