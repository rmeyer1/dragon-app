import { Project } from '@/types/project'

export const projects: Project[] = [
  {
    id: '1',
    name: 'Blackjack',
    description: 'A simulator that allows you to play blackjack against the computer and teaches you basic blackjack strategy.',
    image: '/images/blackjack.png',
    link: 'https://blackjac.netlify.app/',
    techStack: ['React', 'Node.js', 'Tailwind CSS', 'Firebase'],
  },
  {
    id: '2',
    name: 'Hermes',
    description: 'Live sportsbook odds platform for the NFL, NBA, NHL, and more.',
    image: '/images/sportsbook.jpg',
    link: 'https://hermes-odds.netlify.app/',
    techStack: ['React', 'Node.js', 'Tailwind CSS', 'Firebase'],
  },
  // Add more projects here
]