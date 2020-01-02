import React from 'react'

export interface IButtonProps {
    click: any
    label: string
}

export default function Button (props) {

    return <button type="button" className="btn btn-primary" onClick={props.click} > {props.label} </button>
}