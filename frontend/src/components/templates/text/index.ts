import TextBasic from './TextBasic.vue'
import TextCentered from './TextCentered.vue'
import TextSplit from './TextSplit.vue'
import TextHero from './TextHero.vue'

export const textComponents = [
    {
        variant: 'text.basic',
        component: TextBasic,
        createDefaultProps: () => ({
            title: 'Heading',
            text: 'Your text goes here.',
        }),
    },
    {
        variant: 'text.centered',
        component: TextCentered,
        createDefaultProps: () => ({
            title: 'Centered heading',
            text: 'Your text goes here.',
        }),
    },
    {
        variant: 'text.split',
        component: TextSplit,
        createDefaultProps: () => ({
            title: 'Split heading',
            text: 'Your text goes here.',
        }),
    },
    {
        variant: 'text.hero',
        component: TextHero,
        createDefaultProps: () => ({
            title: 'Hero title',
            text: 'This is a hero description.',
        }),
    },
]
