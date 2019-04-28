# Gatsby-paginate

This library provides a simple API for paginating an array of posts/pages for your blog/site homepage in Gatsby js.

_LOOKING FOR MAINTAINERS_ - please email rob@pixelstew.co.uk with subject GATSBY_PAGINATE

## Installation

```
yarn add gatsby-paginate
```

## Usage

- Require the package in your `gatsby-node.js` file.
- Add a call to createPaginatedPages in `gatsby-node.js`.

Then add the following to the top of your `gatsby-node.js` file.

```js
const createPaginatedPages = require('gatsby-paginate')
```

## Use case 1 - paginate list of posts on home page<a name="eg1"></a>

To create a paginated index of your blog posts, you need to do four things:

- Remove the `index.js` file from the pages directory.
- Create an `index.js` file in the templates directory and refer to it in the createPaginatedPages call

### Call createPaginatedPages

You probably already have something like this in your `gatsby-node.js` file to generate the pages for your blog:

```js
exports.createPages = ({ graphql, actions: { createPage } }) => {
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
          component: path.resolve('./src/templates/post.js'),
          context: {
            slug: node.fields.slug,
          },
        })
      })
      resolve()
    })
  })
}
```

Just insert a call to `createPaginatedPages` before (or after) the createPage function:

```js
exports.createPages = ({ graphql, actions: { createPage } }) => {
  return new Promise((resolve, reject) => {
    graphql(`
      //graphql query
    `).then(result => {
      createPaginatedPages({
        edges: result.data.posts.edges,
        createPage: createPage,
        pageTemplate: 'src/templates/index.js',
        pageLength: 5, // This is optional and defaults to 10 if not used
        pathPrefix: '', // This is optional and defaults to an empty string if not used
        context: {}, // This is optional and defaults to an empty object if not used
      })
      result.data.posts.edges.map(({ node }) => {
        createPage({
          path: node.fields.slug,
          component: path.resolve('./src/templates/post.js'),
          context: {
            slug: node.fields.slug,
          },
        })
      })
      resolve()
    })
  })
}
```

Notice that `createPaginatedPages` is being passed an options object.

1. `edges` is the array of nodes that comes from the GraphQL query.
2. `createPage` is simply the `createPage` function you get from `actions`.
3. `pageTemplate` is a template to use for the index page. And
4. `pageLength` is an optional parameter that defines how many posts to show per index page. It defaults to 10.
5. `pathPrefix` is an optional parameter for passing the name of a path to add to the path generated in the `createPage`func. This is used in [use case 2](#eg2) below.
6. `context` is an optional parameter which is used as the `context` property when `createPage` is called.

`createPaginatedPages` will then call `createPage` to create an index page for each of the groups of pages. The content that describes the blogs (title, slug, etc) that will go in each page will be passed to the template through `props.pageContext` so you need to make sure that everything that you want on the index page regarding the blogs should be requested in the GraphQL query in `gatsby-node.js`.

## Use case 2 - paginate a post or use pagination on a page other than index<a name="eg2"></a>

### Call createPaginatedPages in the same way as above but...

This time pass in a `pathPrefix`

```js
createPaginatedPages({
  edges: result.data.posts.edges,
  createPage: createPage,
  pageTemplate: 'src/templates/your_cool_template.js',
  pageLength: 5,
  pathPrefix: 'your_page_name',
  buildPath: (index, pathPrefix) =>
    index > 1 ? `${pathPrefix}/${index}` : `/${pathPrefix}`, // This is optional and this is the default
})
```

Then...

- Create a template in tha same way as above but this time
- Add a `pathPrefix`
- (optional) add `buildPath` if you want to have more control over the pagination URL structure

In this instance a new set of pages will be created at the following path `your_site/your_page_name`
Then a second paginated page of `your_site/your_page_name/2`

**PLEASE NOTE: THE PATH PREFIX FUNCTIONALITY IS UNDER DEVELOPMENT AND MORE FLEXIBILITY WILL BE ADDED SOON**

### Create the template

This is a simple template which might be used in [use case 1](#eg1) above to replace the index of a blog with a paginated list of posts.

The `pageContext` object which contains the following 5 keys is passed to the template;

1. `group` - (arr) an array containing the number of edges/nodes specified in the `pageLength` option.
1. `index` - (int) this is the index of the edge/node.
1. `first` - (bool) **Soon to be deprecated - please calculate first using index and pageCount** - is this the first page?
1. `last` - (bool) **Soon to be deprecated - please calculate last using index and pageCount** - is this the last page?
1. `pageCount` - (int) the total number of pages being paginated through
1. `additionalContext` - (obj) optional additional context

```jsx
import React, { Component } from 'react'
import Link from 'gatsby-link'

const NavLink = props => {
  if (!props.test) {
    return <Link to={props.url}>{props.text}</Link>
  } else {
    return <span>{props.text}</span>
  }
}

const IndexPage = ({ pageContext }) => {
  const { group, index, first, last, pageCount } = pageContext
  const previousUrl = index - 1 == 1 ? '/' : (index - 1).toString()
  const nextUrl = (index + 1).toString()

  return (
    <div>
      <h4>{pageCount} Pages</h4>

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
  )
}
export default IndexPage
```
