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

const buildPaginationRoute = (index, pathPrefix) => {
  return index > 1 ? `${pathPrefix}/${index}` : '/'
}

const isFirstPage = index => (index === 0 ? true : false);

const isLastPage = (index, groups) =>
  index === groups.length - 1 ? true : false;

const createPaginatedPages = (posts, createPage, template, pathPrefix) => {
  posts.forEach((group, index, groups) => {
    return createPage({
      path: buildPaginationRoute(getPageIndex(index), pathPrefix),
      component: template,
      context: {
        group,
        pathPrefix,
        first: isFirstPage(index),
        last: isLastPage(index, groups),
        index: index + 1,
        pageCount: groups.length
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
  pathPrefix = ""
}) => {
  const paginationTemplate = path.resolve(pageTemplate);
  createPaginatedPages(
    filterPages(edges, pageLength),
    createPage,
    paginationTemplate,
    pathPrefix
  );
};
