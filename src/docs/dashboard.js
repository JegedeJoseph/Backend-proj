/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Get dashboard overview data
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data
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
 *                     user:
 *                       type: object
 *                       properties:
 *                         fullName:
 *                           type: string
 *                         avatar:
 *                           type: string
 *                     todayClasses:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TimetableClass'
 *                     pendingTasks:
 *                       type: integer
 *                     unreadNotifications:
 *                       type: integer
 *                     walletBalance:
 *                       type: number
 *                     studyStreak:
 *                       type: integer
 *                     recentNews:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/NewsArticle'
 *       401:
 *         description: Unauthorized
 *
 * /dashboard/quick-stats:
 *   get:
 *     summary: Get quick statistics
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Quick stats
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
 *                     totalDownloads:
 *                       type: integer
 *                     completedTasks:
 *                       type: integer
 *                     studyHours:
 *                       type: number
 *                     currentStreak:
 *                       type: integer
 */
