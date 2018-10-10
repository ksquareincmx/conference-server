import React from 'react'

function RoomLeftHeader(props) {
    const styles = {
        div: {
            fontSize: 10,
            fontWeight: 'bold'
        }
    }

    return (
        <div style={styles.div}>Conference Room # 1 </div>
    );
}

RoomLeftHeader.componentName = 'RoomLeftHeader';

export default RoomLeftHeader;