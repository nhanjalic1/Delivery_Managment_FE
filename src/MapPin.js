import './css/googleMap.css'
import { Icon } from '@iconify/react'
import locationIcon from '@iconify/icons-mdi/map-marker'

const MapPin = ({ text }) => 
    <div>
    <Icon icon={locationIcon} className={"pinicon"} />
    <p className={"pintext"}>{text}</p>
    </div>;

export default MapPin;