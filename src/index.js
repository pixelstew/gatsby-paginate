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

const createPaginatedPages = ({
  edges,
  createPage,
  pageLength = 10,
  pageTemplate,
  pathPrefix = ``,
  buildPath = null,
  context = {},
}) => {
  const groups = createGroups(edges, pageLength)
  const paginationTemplate = path.resolve(pageTemplate)
  groups.forEach((group, index, groups) => {
    const pageIndex = getPageIndex(index)
    return createPage({
      path:
        typeof buildPath === `function`
          ? buildPath(pageIndex, pathPrefix)
          : buildPaginationRoute(pageIndex, pathPrefix),
      component: paginationTemplate,
      context: {
        ...context,
        group,
        pathPrefix,
        first: isFirstPage(index),
        last: isLastPage(index, groups.length),
        index: index + 1,
        pageCount: groups.length,
        // additionalContext remains to avoid breaking changes but is deprecated.
        // Starting with v1.1.0, context passed to createPaginatedPages is spread
        // into createPage's context directly and should be used instead.
        // Resolves https://github.com/pixelstew/gatsby-paginate/issues/29.
        additionalContext: context,
      },
    })
  })
}

module.exports = createPaginatedPages
