const path = require(`path`)

const createGroups = (pages, pageLength) =>
  pages
    .map((edge, index) => {
      return index % pageLength === 0
        ? pages.slice(index, index + pageLength)
        : null
    })
    .filter(item => item)

const getPageIndex = index => (index === 0 ? `` : index + 1)

const buildPaginationRoute = (index, pathPrefix) =>
  index > 1 ? `${pathPrefix}/${index}` : pathPrefix

const isFirstPage = index => index === 0

const isLastPage = (index, length) => index === length - 1

const createPaginatedPages = (
  posts,
  createPage,
  template,
  pathPrefix,
  buildPath,
  context
) => {
  posts.forEach((group, index, groups) => {
    const pageIndex = getPageIndex(index)
    return createPage({
      path:
        typeof buildPath === `function`
          ? buildPath(pageIndex, pathPrefix)
          : buildPaginationRoute(pageIndex, pathPrefix),
      component: template,
      context: Object.assign({
        group,
        pathPrefix,
        first: isFirstPage(index),
        last: isLastPage(index, groups.length),
        index: index + 1,
        pageCount: groups.length,
        additionalContext: context,
      }),
    })
  })
}

module.exports = ({
  edges,
  createPage,
  pageTemplate,
  pageLength = 10,
  pathPrefix = ``,
  buildPath = null,
  context = {},
}) => {
  const paginationTemplate = path.resolve(pageTemplate)
  createPaginatedPages(
    createGroups(edges, pageLength),
    createPage,
    paginationTemplate,
    pathPrefix,
    buildPath,
    context
  )
}
