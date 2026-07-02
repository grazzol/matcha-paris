// src/utils/slugify.js
export function toSlug(name, address) {
    const arr = address.match(/\d{5}/)
    const cp = arr ? arr[0] : ''
    return `${name} ${cp}`
        .toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
}