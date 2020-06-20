import React, { Component } from 'react';
import Moment from 'react-moment';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Paper, Grid, Box, Chip, Avatar, ButtonGroup, Button, Typography } from '@material-ui/core';

import MapView from './map/MapView';
import DeleteDialog from '../common/DeleteDialog';
import styles from './Event.module.css';
import sportImage from '../../img/noImage.svg';
import { deleteEvent, joinEvent } from '../../actions/eventActions';

class EventItem extends Component{
    constructor(){
        super();
        this.state = {
            openDeleteDialog: '',
        };
    }
    handleClickOpen(){
        this.setState({ openDeleteDialog : true});
    };
    
    handleClose(){
        this.setState({ openDeleteDialog : false});
    };

    onDeleteClick(id){
        this.props.deleteEvent(id);
        this.props.history.push('/events');
    }
    
    onJoinClick(id){
        if(!this.props.auth.isAuthenticated){
            this.props.history.push('/login');
        }
        this.props.joinEvent(id);
    }
    
    render(){
        const {event, auth} = this.props;
        return(
            <Paper className="pad-2">
                <Grid container>
                    <Grid item xs={12} md={6}>
                        <span className={styles.labelInfo}>Type of Sport</span>
                        <p>{event.typeofsport}</p>
                        
                        <span className={styles.labelInfo}>Number of Player</span>
                        <p><i className="fas fa-users"></i>{event.numberofplayer}</p>
                        
                        <span className={styles.labelInfo}>Location</span>
                        <p>
                            {event.location ? event.location : "To Be Announced"}
                        </p>
                        
                        <span className={styles.labelInfo}>Start Date</span>
                        <p>
                            {event.start ? <Moment format="MM/DD/YYYY">{event.start}</Moment> : "To Be Announced"}
                        </p>
                        
                        <span className={styles.labelInfo}>Description</span>
                        <p>
                            {event.description ? event.description : "None"}
                        </p>
                        
                        <Typography display="inline">
                             <Link to={`/profile/${event.user._id}`}>
                                Host By {event.user.name}
                            </Link>
                        </Typography>
                        
                        {event.user._id === auth.user.id ? (
                            <ButtonGroup className="marginL-1">
                                <Button
                                    component={Link}
                                    to="/create-event"
                                    variant="contained"
                                    color="primary" >
                                    Edit
                                </Button>
                                <Button 
                                    onClick={this.handleClickOpen.bind(this)}
                                    variant="contained"
                                    color="secondary" >
                                    Delete
                                </Button>
                            </ButtonGroup>
                        ) : null}
                        
                       
                    </Grid>
                    <Grid container item xs={12} md={6}>
                        <img className="marginB-1" style={{width: '100%'}} src={event.imageURL ? event.imageURL : sportImage}
                          alt="Sport" />
                    </Grid>
                </Grid>
                {event.address ? <MapView coordinates={event.address.coordinates} location={event.location}/> : null}
                <hr />
                <Box display="flex">
                    <Button 
                        className="primary-color"
                        onClick={this.onJoinClick.bind(this, event._id)}
                        variant="contained"
                        color="primary" >
                        {auth.isAuthenticated ? "Join This Event" : "Login to Join"}
                    </Button>
                    <p className="marginL-1">{event.numberofplayer - event.listofplayer.length} spots left</p>
                </Box>
                <div className="marginT-1">
                    { event.listofplayer.map((player, index) => {
                        return <Chip
                            key={player._id}
                            className="marginR-1 marginX-1"
                            avatar={<Avatar>{index + 1}</Avatar>} 
                            label={player.name}
                            variant="outlined" />
                    }) }
                </div>
                <DeleteDialog
                    onDeleteClick={this.onDeleteClick.bind(this, event._id)}
                    openDeleteDialog={this.state.openDeleteDialog}
                    handleClose={this.handleClose.bind(this)} />
            </Paper>
        );
    }
}

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(mapStateToProps, { deleteEvent, joinEvent })(withRouter(EventItem));