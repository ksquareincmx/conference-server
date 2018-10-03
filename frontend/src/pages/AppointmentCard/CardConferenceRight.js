import React from 'react'

function CardConferenceRight(props) {
    const styles = {
        div: {
            fontSize: 10
        }
    }
    return (
        <span style={styles.div}> (Status) </span>
    );
}

CardConferenceRight.componentName = 'CardRightStatus'

export default CardConferenceRight;