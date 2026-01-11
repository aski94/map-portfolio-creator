import BasicImage from './Image.vue'

export const imageComponents = [
    {
        variant: 'image.basic',
        name: 'Basic image',
        component: BasicImage,
        createDefaultProps() {
            return {
                src: '',
                caption: '',
                style: {
                    align: 'left',
                    maxWidth: 260,
                    padTop: 0,
                    padRight: 0,
                    padBottom: 0,
                    padLeft: 0,
                },
            }
        }

    },
]
