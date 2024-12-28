import { Project } from '@/types/project'
import './ProjectCard.css'
import { FaReact, FaNodeJs } from 'react-icons/fa'
import { SiTypescript, SiTailwindcss } from 'react-icons/si'

// Create a mapping object for tech stack icons
const techStackIcons: { [key: string]: JSX.Element } = {
  'React': <FaReact className="text-[#61DAFB]" />,
  'Node.js': <FaNodeJs className="text-[#339933]" />,
  'TypeScript': <SiTypescript className="text-[#3178C6]" />,
  'Tailwind CSS': <SiTailwindcss className="text-[#06B6D4]" />,
}

interface ProjectCardProps {
  project: Project
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <div className="project-card">
      <img
        src={project.image}
        alt={project.name}
        className="project-card__image"
      />
      <div className="project-card__content">
        <h2 className="project-card__title">{project.name}</h2>
        <p className="project-card__description">{project.description}</p>
        
        <div className="project-card__tech-section">
          <h3 className="project-card__tech-title">Tech Stack:</h3>
          <div className="project-card__tech-stack">
            {project.techStack.map((tech) => (
              <span 
                key={tech} 
                className="project-card__tech-item"
              >
                 {techStackIcons[tech] || tech}
              </span>
            ))}
          </div>
        </div>
        
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card__link"
          >
            View Project →
          </a>
        )}
      </div>
    </div>
  )
}

export default ProjectCard 