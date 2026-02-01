/**
 * @swagger
 * /news:
 *   get:
 *     summary: Get all news articles with pagination
 *     tags: [Campus News]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [Academic, Events, Sports, Announcements, Campus Life, Other]
 *       - in: query
 *         name: isFeatured
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of news articles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     articles:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/NewsArticle'
 *                     pagination:
 *                       type: object
 *
 * /news/featured:
 *   get:
 *     summary: Get featured news articles
 *     tags: [Campus News]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 5
 *     responses:
 *       200:
 *         description: Featured news articles
 *
 * /news/{id}:
 *   get:
 *     summary: Get single news article
 *     tags: [Campus News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: News article details
 *       404:
 *         description: Article not found
 *
 * /news/{id}/like:
 *   post:
 *     summary: Like a news article
 *     tags: [Campus News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article liked/unliked
 *       401:
 *         description: Unauthorized
 *
 * /news/{id}/bookmark:
 *   post:
 *     summary: Bookmark a news article
 *     tags: [Campus News]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Article bookmarked/unbookmarked
 *
 * /news/bookmarks:
 *   get:
 *     summary: Get user's bookmarked articles
 *     tags: [Campus News]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookmarked articles
 */
