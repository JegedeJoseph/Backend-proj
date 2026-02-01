/**
 * @swagger
 * /past-questions:
 *   get:
 *     summary: Get all past questions with filters
 *     tags: [Past Questions]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *       - in: query
 *         name: courseCode
 *         schema:
 *           type: string
 *         description: Filter by course code
 *       - in: query
 *         name: semester
 *         schema:
 *           type: string
 *           enum: [First, Second, Summer]
 *         description: Filter by semester
 *       - in: query
 *         name: level
 *         schema:
 *           type: string
 *           enum: ['100', '200', '300', '400', '500', '600', 'Postgraduate']
 *         description: Filter by level
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title, course name, code
 *       - in: query
 *         name: isPaid
 *         schema:
 *           type: boolean
 *         description: Filter by paid/free
 *     responses:
 *       200:
 *         description: List of past questions
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
 *                     questions:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/PastQuestion'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         page:
 *                           type: integer
 *                         limit:
 *                           type: integer
 *                         total:
 *                           type: integer
 *                         pages:
 *                           type: integer
 *
 * /past-questions/{id}:
 *   get:
 *     summary: Get single past question
 *     tags: [Past Questions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Past question ID
 *     responses:
 *       200:
 *         description: Past question details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/PastQuestion'
 *       404:
 *         description: Past question not found
 *
 * /past-questions/upload:
 *   post:
 *     summary: Upload a past question
 *     tags: [Past Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - courseName
 *               - courseCode
 *               - semester
 *               - level
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: PDF, DOC, DOCX, or image file
 *               courseName:
 *                 type: string
 *                 example: General Physics
 *               courseCode:
 *                 type: string
 *                 example: PHY 101
 *               semester:
 *                 type: string
 *                 enum: [First, Second, Summer]
 *               level:
 *                 type: string
 *                 enum: ['100', '200', '300', '400', '500', '600', 'Postgraduate']
 *               tags:
 *                 type: string
 *                 description: Comma-separated tags
 *               isPaid:
 *                 type: boolean
 *                 default: false
 *               price:
 *                 type: number
 *                 default: 0
 *     responses:
 *       201:
 *         description: Past question uploaded successfully
 *       400:
 *         description: Validation error or no file uploaded
 *       401:
 *         description: Unauthorized
 *
 * /past-questions/{id}/download:
 *   post:
 *     summary: Download or purchase a past question
 *     tags: [Past Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Past question ID
 *     responses:
 *       200:
 *         description: Download URL returned
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
 *                     fileUrl:
 *                       type: string
 *       400:
 *         description: Insufficient wallet balance
 *       404:
 *         description: Past question not found
 *
 * /past-questions/{id}/rate:
 *   post:
 *     summary: Rate a past question
 *     tags: [Past Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Past question ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Rating submitted
 *       400:
 *         description: Must download before rating
 *
 * /past-questions/user/my-uploads:
 *   get:
 *     summary: Get user's uploaded past questions
 *     tags: [Past Questions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's uploads
 */
