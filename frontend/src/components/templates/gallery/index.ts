import Gallery from './Gallery.vue'
import type { GalleryItem } from './Gallery.vue'

export const galleryComponents = [
    {
        variant: 'gallery.grid',
        component: Gallery,
        createDefaultProps: () => ({
            heading: 'Gallery',
            layout: 'grid' as const,
            items: defaultItems(),
            style: defaultStyle(),
        }),
    },
    {
        variant: 'gallery.slider',
        component: Gallery,
        createDefaultProps: () => ({
            heading: 'Gallery',
            layout: 'slider' as const,
            items: defaultItems(),
            style: defaultStyle(),
        }),
    },
] as const

function defaultItems(): GalleryItem[] {
    return [
        {
            id: crypto.randomUUID(),
            imageSrc: '',
            imageFit: 'cover',
            imagePosX: 50,
            imagePosY: 50,
        },
    ]
}

function defaultStyle() {
    return {
        columns: 3,
        gap: 8,
        imageHeight: 200,
        padTop: 0,
        padRight: 0,
        padBottom: 0,
        padLeft: 0,
    }
}
