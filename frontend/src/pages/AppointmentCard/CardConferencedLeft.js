import React from 'react'

function CardConferencedLeft(props) {
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

CardConferencedLeft.componentName = 'CardLeftStatus';

export default CardConferencedLeft;