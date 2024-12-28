import ProjectCard from '@/components/ProjectCard'
import { projects } from '@/data/projects'
import './Projects.css'

const Projects = () => {
  return (
    <div className="projects-container">
      <h1 className="projects-title">
        Projects
      </h1>
      
      <div className="projects-grid">
        {projects.map((project) => (
          <div key={project.id}>
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Projects 