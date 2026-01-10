import TextBasic from './TextBasic.vue'

export const textComponents = [
    {
        variant: 'text',
        component: TextBasic,
        createDefaultProps: () => ({
            title: 'Heading',
            text: 'Your text goes here.',
        }),
    },
]
