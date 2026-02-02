/**
 * @swagger
 * /timetable:
 *   get:
 *     summary: Get user's full timetable
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Full weekly timetable
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
 *                     schedule:
 *                       type: object
 *                       description: Object with day names as keys
 *                       properties:
 *                         Sunday:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/TimetableClass'
 *                         Monday:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/TimetableClass'
 *                         Tuesday:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/TimetableClass'
 *                         Wednesday:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/TimetableClass'
 *                         Thursday:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/TimetableClass'
 *                         Friday:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/TimetableClass'
 *                         Saturday:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/TimetableClass'
 *       401:
 *         description: Unauthorized
 *
 * /timetable/class:
 *   post:
 *     summary: Add a class to timetable
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - day
 *               - classData
 *             properties:
 *               day:
 *                 type: string
 *                 enum: [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]
 *                 description: Day of the week
 *               classData:
 *                 $ref: '#/components/schemas/TimetableClass'
 *           example:
 *             day: "Monday"
 *             classData:
 *               courseCode: "CSC 101"
 *               courseName: "Introduction to Computer Science"
 *               startTime: "09:00"
 *               endTime: "11:00"
 *               location: "LT 1"
 *               professor: "Dr. Smith"
 *               iconName: "computer"
 *               accentColor: "#4287f5"
 *     responses:
 *       201:
 *         description: Class added successfully
 *       400:
 *         description: Validation error
 *
 * /timetable/class/{day}/{classIndex}:
 *   put:
 *     summary: Update a class in timetable
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: day
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]
 *         description: Day of the week
 *       - in: path
 *         name: classIndex
 *         required: true
 *         schema:
 *           type: integer
 *         description: Index of the class in the day's array
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TimetableClass'
 *     responses:
 *       200:
 *         description: Class updated
 *       404:
 *         description: Class not found
 *
 *   delete:
 *     summary: Delete a class from timetable
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: day
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]
 *       - in: path
 *         name: classIndex
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Class deleted
 *       404:
 *         description: Class not found
 *
 * /timetable/day/{day}:
 *   get:
 *     summary: Get schedule for a specific day
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: day
 *         required: true
 *         schema:
 *           type: string
 *           enum: [Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday]
 *         description: Day of the week
 *     responses:
 *       200:
 *         description: Day's schedule
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
 *                     day:
 *                       type: string
 *                     classes:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/TimetableClass'
 *
 * /timetable/today:
 *   get:
 *     summary: Get today's schedule
 *     tags: [Timetable]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Today's classes
 */
