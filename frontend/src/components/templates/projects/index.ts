import Projects from './Projects.vue'
import type { ProjectItem } from './Projects.vue'

export const projectComponents = [
    {
        variant: 'projects.grid',
        component: Projects,
        createDefaultProps: () => ({
            heading: 'Projects',
            layout: 'grid' as const,
            projects: defaultProjects(),
        }),
    },
    {
        variant: 'projects.list',
        component: Projects,
        createDefaultProps: () => ({
            heading: 'Projects',
            layout: 'list' as const,
            projects: defaultProjects(),
        }),
    },
] as const

function defaultProjects(): ProjectItem[] {
    return [
        {
            id: crypto.randomUUID(),
            title: 'Project name',
            description: 'Short description of what you built.',
            tags: ['Tag 1', 'Tag 2'],
            imageSrc: '',
            imageFit: 'cover',
            imageHeight: 200,
            imagePosX: 50,
            imagePosY: 50,
            github: '',
            other: '',
        },
    ]
}