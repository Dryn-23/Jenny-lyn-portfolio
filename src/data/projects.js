/**
 * projects.js — the starter project library.
 *
 * Adding a project is normally done through the "Add Project" button on the
 * site (it saves to localStorage). This file is the *seed* content that shows
 * up on a first visit — edit it to change what a brand-new visitor sees.
 *
 * Project object shape:
 * {
 *   id:           unique string
 *   title:        string
 *   description:  string
 *   image:        string  (any URL or /public path — optional)
 *   category:     'Web Development' | 'Desktop Applications' | 'School Projects' | 'Personal Projects'
 *   technologies: string[]
 *   liveUrl:      string  (optional)
 *   githubUrl:    string  (optional)
 *   year:         number|string
 *   featured:     boolean
 *   source:       'seed' | 'user'  (user projects are editable/deletable)
 * }
 */

export const PROJECT_CATEGORIES = [
  'Web Development',
  'Desktop Applications',
  'School Projects',
  'Personal Projects',
];

export const seedProjects = [
  {
    id: 'seed-amfaye-bites',
    title: 'Amfaye Bites',
    description:
      'A web-based pastry and fruit shake ordering and POS system — browse the menu, build an order, and check out through a clean point-of-sale flow.',
    image: '/projects/amfaye-bites.jpg',
    category: 'Web Development',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    liveUrl: 'https://example.com/amfaye-bites',
    githubUrl: 'https://github.com/Jenny-lyngarin/amfaye-bites',
    year: 2026,
    featured: true,
    source: 'seed',
  },
  {
    id: 'seed-lost-and-found',
    title: 'Lost & Found System',
    description:
      'A system for managing lost and found items — log reports, match found items to claims, and keep a searchable record across the campus.',
    image: '/projects/lost-and-found.jpg',
    category: 'School Projects',
    technologies: ['JavaScript', 'PHP', 'MySQL', 'Bootstrap'],
    liveUrl: '',
    githubUrl: 'https://github.com/Jenny-lyngarin/lost-and-found',
    year: 2025,
    featured: false,
    source: 'seed',
  },
  {
    id: 'seed-hotel-management',
    title: 'Hotel Management System',
    description:
      'A desktop application for hotel operations: room availability, reservations, guest records, and billing in a single offline-friendly tool.',
    image: '/projects/hotel-management.jpg',
    category: 'Desktop Applications',
    technologies: ['Java', 'JavaFX', 'MySQL'],
    liveUrl: '',
    githubUrl: 'https://github.com/Jenny-lyngarin/hotel-management',
    year: 2025,
    featured: false,
    source: 'seed',
  },
  {
    id: 'seed-focus-desk',
    title: 'Focus Desk',
    description:
      'A small task manager I built to keep up with school requirements — deadlines, subject tags, and a focus timer that keeps me honest.',
    image: '/projects/focus-desk.jpg',
    category: 'Personal Projects',
    technologies: ['React', 'Vite', 'localStorage'],
    liveUrl: 'https://example.com/focus-desk',
    githubUrl: 'https://github.com/Jenny-lyngarin/focus-desk',
    year: 2026,
    featured: false,
    source: 'seed',
  },
];
