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

const buildPaginationRoute = (index, pathPrefix) =>
  index > 1 ? `${pathPrefix}/${index}` : `/${pathPrefix}`;

const isFirstPage = index => (index === 0 ? true : false);

const isLastPage = (index, groups) =>
  index === groups.length - 1 ? true : false;

const createPaginatedPages = (
  posts,
  createPage,
  template,
  pathPrefix,
  buildPath,
  context,
  layout
) => {
  posts.forEach((group, index, groups) => {
    const pageIndex = getPageIndex(index);
    return createPage({
      path:
        typeof buildPath === "function"
          ? buildPath(pageIndex, pathPrefix)
          : buildPaginationRoute(pageIndex, pathPrefix),
      component: template,
      context: Object.assign({
        group,
        pathPrefix,
        first: isFirstPage(index),
        last: isLastPage(index, groups),
        index: index + 1,
        pageCount: groups.length,
        additionalContext: context
      }),
      layout
    });
  });
};

module.exports = ({
  edges,
  createPage,
  pageTemplate,
  pageLength = 10,
  pathPrefix = "",
  buildPath = null,
  context = {},
  layout = 'index'
}) => {
  const paginationTemplate = path.resolve(pageTemplate);
  createPaginatedPages(
    filterPages(edges, pageLength),
    createPage,
    paginationTemplate,
    pathPrefix,
    buildPath,
    context,
    layout
  );
};
