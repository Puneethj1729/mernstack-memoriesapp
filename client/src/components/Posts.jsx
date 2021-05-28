import {React, useEffect, useState} from 'react';
import Post from './Posts/Post';
import makeStyles from './postsStyles';
import {Grid, CircularProgress} from '@material-ui/core';

import axios from 'axios';
function Posts (props) {
  const [posts, setPosts] = useState ([]);
  const classes = makeStyles ();
  
  useEffect (
    () => {
      axios
        .get('https://mernfullstack-app.herokuapp.com/api/posts')
        .then((response) => setPosts(response.data))
        .catch((error) => console.log(error));
    },
    [props.Id]
  );
  function deletePost (id) {
    const token = JSON.parse(localStorage.getItem('profile')).token;
    axios
      .delete('https://mernfullstack-app.herokuapp.com/api/delete/' + id, {
        headers: { Authorization: 'Bearer ' + token },
      })
      .then(
        setPosts((posts) =>
          posts.filter((post) => {
            return post._id !== id;
          })
        )
      );
  }
  function updateLikeCount (id) {
    const token = JSON.parse(localStorage.getItem('profile')).token;
    axios
      .get('https://mernfullstack-app.herokuapp.com/api/updateLike/' + id, {
        headers: { Authorization: 'Bearer ' + token },
      })
      .then((response) => {
        setPosts((posts) => {
          let requiredPost = posts.filter((post) => post._id === id);
          requiredPost[0].likes = response.data.likes;
          return [...posts];
        });
      });
  }

  return !posts.length
    ? <CircularProgress />
    : <Grid
        className={classes.mainContainer}
        container
        alignItems="stretch"
        spacing={3}
      >
        {posts.map ((post, index) => (
          <Grid key={index} xs={12} sm={5} item>
            <Post
              setCurrentId={props.setCurrentId}
              onDeleted={deletePost}
              setLike={updateLikeCount}
              post={post}
            />
          </Grid>
        ))}

      </Grid>;
}
export default Posts;
