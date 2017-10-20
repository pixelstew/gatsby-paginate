const path = require('path');

const filterPages = (posts, pageLength) => {
  return posts
    .map((edge, index) => {
      return index % pageLength === 0
        ? posts.slice(index, index + pageLength)
        : null;
    })
    .filter(item => item);
}

const createPaginatedPages = (posts, createPage, template) => {
  posts.forEach((group, index, groups) => {
    const pageIndex = index === 0 ? "" : index + 1;
    const paginationRoute = `/${pageIndex}`;
    const first = index === 0 ? true : false;
    const last = index === groups.length - 1 ? true : false;
    return createPage({
      path: paginationRoute,
      component: template,
      context: {
        group,
        first,
        last,
        index: index + 1
      }
    });
  });
}

module.exports = ({ edges, createPage, pageTemplate, pageLength = 10 }) => {
  const paginationTemplate = path.resolve(pageTemplate);
  createPaginatedPages(filterPages(edges, pageLength), createPage, paginationTemplate)
};


