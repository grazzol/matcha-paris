// src/components/Icons.jsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faExpand,
    faCompress,
    faLaptop,
    faLeaf,
    faVolumeXmark,
    faVolumeLow,
    faVolumeHigh,
    faWandMagicSparkles,
    faLocationDot,
    faShuffle,
    faHeart,
    faCrosshairs,
    faArrowUpRightFromSquare,
    faStar,
    faStarHalfStroke,
} from '@fortawesome/free-solid-svg-icons'
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons'

export function IconPlace({ spacieux }) {
    return <FontAwesomeIcon icon={spacieux ? faExpand : faCompress} />
}

export function IconPC() {
    return <FontAwesomeIcon icon={faLaptop} />
}

export function IconMatcha() {
    return <FontAwesomeIcon icon={faLeaf} />
}

export function IconCalme({ level }) {
    if (level >= 4) return <FontAwesomeIcon icon={faVolumeXmark} />
    if (level >= 2) return <FontAwesomeIcon icon={faVolumeLow} />
    return <FontAwesomeIcon icon={faVolumeHigh} />
}

export function IconOriginalite() {
    return <FontAwesomeIcon icon={faWandMagicSparkles} />
}

export function IconLocation() {
    return <FontAwesomeIcon icon={faLocationDot} />
}

export function IconShuffle() {
    return <FontAwesomeIcon icon={faShuffle} />
}

export function IconHeart({ filled }) {
    return (
        <FontAwesomeIcon
            icon={faHeart}
            style={{ color: filled ? '#e85d6a' : 'currentColor' }}
        />
    )
}

export function IconCrosshairs() {
    return <FontAwesomeIcon icon={faCrosshairs} />
}

export function IconExternalLink() {
    return <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
}

export function StarRating({ rating, max = 5 }) {
    const full = Math.floor(rating)
    const half = rating % 1 >= 0.5 ? 1 : 0
    const empty = max - full - half
    return (
        <span className="star-rating">
            {[...Array(full)].map((_, i) => (
                <FontAwesomeIcon key={`f${i}`} icon={faStar} />
            ))}
            {half === 1 && <FontAwesomeIcon icon={faStarHalfStroke} />}
            {[...Array(empty)].map((_, i) => (
                <FontAwesomeIcon key={`e${i}`} icon={faStarEmpty} />
            ))}
        </span>
    )
}