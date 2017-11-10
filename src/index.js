const path = require("path");

const filterPages = (posts, pageLength) => {
  return posts
    .map((edge, index) => {
      return index % pageLength === 0
        ? posts.slice(index, index + pageLength)
        : null;
    })
    .filter(item => item);
};

const getPageIndex = index => (index === 0 ? "" : index + 1);

const buildPaginationRoute = (index, post) => `${post}/${index}`;

const isFirstPage = index => (index === 0 ? true : false);

const isLastPage = (index, groups) =>
  index === groups.length - 1 ? true : false;

const createPaginatedPages = (posts, createPage, template, post) => {
  posts.forEach((group, index, groups) => {
    return createPage({
      path: buildPaginationRoute(getPageIndex(index), post),
      component: template,
      context: {
        group,
        first: isFirstPage(index),
        last: isLastPage(index, groups),
        index: index + 1,
        prefix: post
      }
    });
  });
};

module.exports = ({
  edges,
  createPage,
  pageTemplate,
  pageLength = 10,
  paginatePost = ""
}) => {
  const paginationTemplate = path.resolve(pageTemplate);
  createPaginatedPages(
    filterPages(edges, pageLength),
    createPage,
    paginationTemplate,
    paginatePost
  );
};
