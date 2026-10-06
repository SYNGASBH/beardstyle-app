const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const courses = require('../frontend/src/data/academyCourses.json');
const lessons = Object.fromEntries(courses.map(course => [course.id, course.lessons.map(lesson => lesson.id)]));
const target = path.join(root, 'backend/src/data/academyLessons.json');
if (process.argv.includes('--check')) {
  if (JSON.stringify(JSON.parse(fs.readFileSync(target, 'utf8'))) !== JSON.stringify(lessons)) {
    throw new Error('Academy catalogs differ. Run node scripts/sync-academy-catalog.cjs');
  }
} else fs.writeFileSync(target, JSON.stringify(lessons,null,2) + '\n');
