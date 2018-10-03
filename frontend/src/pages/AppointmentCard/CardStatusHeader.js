import React from 'react'
import { Grid } from '@material-ui/core/'

function CardStatusHeader(props) {

    const leftSide = props.children.find(child => child.type.componentName === 'CardLeftStatus')
    const rightSide = props.children.find(child => child.type.componentName === 'CardRightStatus')

    return (
        <Grid container justify='space-between' alignItems='center' style={{ height: 50, padding: 25 }}>
            {leftSide}
            {rightSide}
        </Grid>
    );
}

CardStatusHeader.componentName = 'CardStatusHeader'

export default CardStatusHeader;