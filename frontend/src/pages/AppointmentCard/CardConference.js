import React from 'react'
import { Card, Grid, CardContent, Divider } from '@material-ui/core/';
import CardStatusHeader from './CardStatusHeader'
import CardLeftStatus from './CardConferencedLeft'
import CardRightStatus from './CardConferenceRight'
import Button from '../../components/MaterialButton'

function CardConference(props) {
    const styles = {
        card: {
            height: 150,
            marginTop: 20,
            borderRadius: 25,
            padding: 3
        }
    }
    styles.card.backgroundColor = props.backgroundColor
    return (
        <Card style={styles.card}>
            <Grid container direction='row' style={{ height: '100%' }}>
                <Grid item xs={12}>
                    <CardStatusHeader>
                        <CardLeftStatus />
                        <CardRightStatus />
                    </CardStatusHeader>
                    <Divider />
                </Grid>

                <Grid>
                    <CardContent>
                        <div>Some information</div>
                    </CardContent>
                </Grid>
                <Grid container justify='flex-end'>
                    <Button textButton='Quick Appointment' colorButton={props.colorButton} />
                </Grid>
            </Grid>
        </Card>
    );
}

export default CardConference;