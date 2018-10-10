import React from 'react'

function RoomRightHeader(props) {
    const styles = {
        div: {
            fontSize: 10
        }
    }
    return (
        <span style={styles.div}> (Status) </span>
    );
}

RoomRightHeader.componentName = 'RoomRightHeader'

export default RoomRightHeader;