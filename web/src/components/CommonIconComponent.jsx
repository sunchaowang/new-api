// src/components/IconComponent
import React from 'react'

class IconComponent extends React.Component {
    render () {
        const { icon, className, ...other } = this.props
        return (
            <svg className={`icon ${className}`} { ...other } aria-hidden="true">
                <use xlinkHref={icon}></use>
            </svg>
        )
    }
}

export default IconComponent

