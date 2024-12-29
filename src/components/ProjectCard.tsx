import { Project } from '@/types/project'
import { FaReact, FaNodeJs } from 'react-icons/fa'
import { SiTailwindcss, SiTypescript } from 'react-icons/si'

// Create a mapping object for tech stack icons with their colors
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
    <div className="bg-[#111111] rounded-2xl overflow-hidden transition-transform hover:scale-[1.02]">
      {/* Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Container */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <h2 className="text-2xl font-bold">{project.name}</h2>
        
        {/* Description */}
        <p className="text-gray-300 text-lg">
          {project.description}
        </p>
        
        {/* Tech Stack Section */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Tech Stack:</h3>
          <div className="flex flex-wrap gap-4">
            {project.techStack.map((tech) => (
              <span 
                key={tech} 
                className="flex items-center gap-2 text-2xl"
                title={tech}
              >
                {techStackIcons[tech] || tech}
              </span>
            ))}
          </div>
        </div>
        
        {/* Project Link */}
        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-white hover:text-purple-500 transition-colors mt-4"
          >
            View Project →
          </a>
        )}
      </div>
    </div>
  )
}

export default ProjectCard 