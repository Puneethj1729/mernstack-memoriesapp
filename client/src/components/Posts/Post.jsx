import React from 'react';
import makeStyles from './postStyles';
import ThumbUpAltOutlined from '@material-ui/icons/ThumbUpAltOutlined';
import moment from 'moment';

import {
  Card,
  CardMedia,
  CardActions,
  CardContent,
  Button,
  Typography,
} from '@material-ui/core';

import ThumbUpAltIcon from '@material-ui/icons/ThumbUpAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';


function Post (props) {
  const classes = makeStyles ();
  
  
  const user= JSON.parse(localStorage.getItem('profile'));
  
  
  const Likes = () => {
    if (props.post.likes.length > 0) {
      return props.post.likes.find(
        (like) => like === (user?.result?.googleId || user?.result?._id)
      ) ? (
        <>
          <ThumbUpAltIcon fontSize='small' />
          &nbsp;
          {props.post.likes.length > 2
            ? `You and ${props.post.likes.length - 1} others`
            : `${props.post.likes.length} like${props.post.likes.length > 1 ? 's' : ''}`}
        </>
      ) : (
        <>
          <ThumbUpAltOutlined fontSize='small' />
          &nbsp;{props.post.likes.length} {props.post.likes.length === 1 ? 'Like' : 'Likes'}
        </>
      );
    }

    return (
      <>
        <ThumbUpAltOutlined fontSize='small' />
        &nbsp;Like
      </>
    );
  };
  
  return (
    <Card className={classes.card} style={{borderRadius:'15px !important'}}>
      <CardMedia
        className={classes.media}
        image={props.post.selectedFile}
        title={props.post.title}
      />
      <div className={classes.overlay}>
        <Typography variant='h6'>{props.post.name}</Typography>
        <Typography variant='body2'>
          {moment(props.post.createdAt).fromNow()}
        </Typography>
      </div>
      {(user && (user?.result?.googleId === props?.post?.creator ||
        user?.result?._id === props?.post?.creator)) && (
        <div className={classes.overlay2}>
          <Button
            style={{ color: 'white' }}
            size='small'
            disabled={!user}
            onClick={() => props.setCurrentId(props.post._id)}>
            <MoreHorizIcon fontSize='default' />
          </Button>
        </div>
      )}

      <div className={classes.details}>
        <Typography variant='body2' color='textSecondary' component='h2'>
          {props.post.tags.map((tag) => '#' + tag.split(' ').join('') + ' ')}
        </Typography>
      </div>
      <Typography
        className={classes.title}
        variant='h5'
        component='h2'
        gutterBottom>
        {props.post.title}
      </Typography>
      <CardContent>
        <Typography variant='body1' color='textSecondary' component='p'>
          {props.post.message}
        </Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button
          size='small'
          color='primary'
          disabled={!user}
          onClick={() => props.setLike(props.post._id)}>
          <Likes />
        </Button>
        {(user && (user?.result?.googleId === props?.post?.creator ||
          user?.result?._id === props?.post?.creator)) && (
          <Button
            size='small'
            color='primary'
            disabled={!user}
            onClick={() => {
              props.onDeleted(props.post._id);
            }}>
            <DeleteIcon fontSize='small' /> Delete
          </Button>
        )}
      </CardActions>
    </Card>
  );
}
export default Post;
