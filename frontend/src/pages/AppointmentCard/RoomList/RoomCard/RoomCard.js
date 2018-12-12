import React from 'react'
import { Card, Grid, CardContent, Divider } from '@material-ui/core/';
import RoomHeader from './RoomHeader'
import RoomLeftHeader from './RoomLeftHeader'
import RoomRightHeader from './RoomRightHeader'
import Button from '../../../../components/MaterialButton'

function RoomCard(props) {
    const styles = {
        card: {
            height: 150,
            marginTop: 20,
            borderRadius: 25,
            padding: 3
        }
    }
    styles.card.backgroundColor = props.backgroundColor

    let colorStatus = 'green'
    if (props.status) {
        colorStatus = 'red'
    }

    return (
        <Card style={styles.card}>
            <Grid container direction='row' style={{ height: '100%' }}>
                <Grid item xs={12}>
                    <RoomHeader>
                        <RoomLeftHeader roomName={props.roomName} />
                        <RoomRightHeader colorStatus={colorStatus} />
                    </RoomHeader>
                    <Divider />
                </Grid>

                <Grid>
                    <CardContent>
                        <div>Some information</div>
                    </CardContent>
                </Grid>
                <Grid container justify='flex-end'>
                    <Button textButton='Quick Appointment' colorButton={props.colorButton} onClick={props.onClick} />
                </Grid>
            </Grid>
        </Card>
    );
}

export default RoomCard;