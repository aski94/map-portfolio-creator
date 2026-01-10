import TextBasic from './Text.vue'

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
