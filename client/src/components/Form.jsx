import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';

import FileBase from 'react-file-base64';
import makeStyles from './formStyles';
import axios from 'axios';
function Form(props) {
  const classes = makeStyles();
  const currentId = props.Id;
  const user=JSON.parse(localStorage.getItem("profile"));
  const [postData, setPostData] = useState({
    
    title: '',
    message: '',
    tags: '',
    selectedFile: '',
  });

  useEffect(() => {
    if (currentId) {
      const token = JSON.parse(localStorage.getItem('profile')).token;
      axios
        .get('https://mernfullstack-app.herokuapp.com/api/' + currentId, {
          headers: { Authorization: 'Bearer ' + token },
        })
        .then((response) =>
          setPostData({
            title: response.data.title,
            message: response.data.message,
            tags: response.data.tags,
            selectedFile: response.data.selectedFile,
          })
        );
    }
  }, [currentId]);

  function handleSubmit(event) {
    event.preventDefault();
    const post = {
      name:user.result.name,
      title: postData.title,
      message: postData.message,
      tags: postData.tags,
      selectedFile: postData.selectedFile,
    };
    if (currentId) {
      const token = JSON.parse(localStorage.getItem('profile')).token;
      axios
        .post(
          'https://mernfullstack-app.herokuapp.com/api/update/' + currentId,
          post,
          {
            headers: { Authorization: 'Bearer ' + token },
          }
        )
        .then((response) => {
          handleClear();
          if (currentId === null) {
            props.setCurrentId(0);
          } else {
            props.setCurrentId(null);
          }
        });
    } else {
      const token = JSON.parse(localStorage.getItem('profile')).token;
      axios
        .post('https://mernfullstack-app.herokuapp.com/api/create', post, {
          headers: { Authorization: 'Bearer ' + token },
        })
        .then((response) => {
          handleClear();
          if (currentId === 0) {
            props.setCurrentId(null);
          } else {
            props.setCurrentId(0);
          }
        });
    }
  }
  function handleClear() {
    setPostData({
      
      title: '',
      message: '',
      tags: '',
      selectedFile: '',
    });
  }
  
  function handleTitle(event) {
    const { name, value } = event.target;
    setPostData((postData) => {
      return {
        ...postData,
        [name]: value,
      };
    });
  }
  function handleMessage(event) {
    const { name, value } = event.target;
    setPostData((postData) => {
      return {
        ...postData,
        [name]: value,
      };
    });
  }
  function handleTags(event) {
    const { name, value } = event.target;
    setPostData((postData) => {
      return {
        ...postData,
        [name]: value.split(','),
      };
    });
  }
  if (!user) {
    return (
      <Paper className={classes.paper}>
        <Typography variant='h6' align='center'>
          Please Sign In to create your own memories and like other's memories.
        </Typography>
      </Paper>
    );
  }
  return (
    <Paper className={classes.paper}>
      <form
        autoComplete='off'
        noValidate
        className={classes.form}
        onSubmit={handleSubmit}>
        <Typography variant='h6'>
          {!currentId ? 'Creating a Memory' : 'Updating a Memory'}
        </Typography>
        
        <TextField
          name='title'
          variant='outlined'
          label='Title'
          fullWidth
          className={classes.textfield}
          value={postData.title}
          onChange={handleTitle}
        />
        <TextField
          name='message'
          variant='outlined'
          label='Message'
          fullWidth
          className={classes.textfield}
          value={postData.message}
          onChange={handleMessage}
        />
        <TextField
          name='tags'
          variant='outlined'
          label='Tags'
          fullWidth
          className={classes.textfield}
          value={postData.tags}
          onChange={handleTags}
        />
        <div className={classes.fileInput}>
          <FileBase
            type='file'
            mutliple={false}
            value={postData.selectedFile}
            onDone={({ base64 }) =>
              setPostData((postData) => {
                return { ...postData, selectedFile: base64 };
              })
            }
          />
        </div>
        <Button
          className={classes.buttonSubmit}
          variant='contained'
          color='primary'
          size='large'
          type='submit'
          fullWidth>
          Submit
        </Button>
        <Button
          variant='contained'
          color='secondary'
          size='small'
          onClick={handleClear}
          fullWidth>
          Clear
        </Button>
      </form>
    </Paper>
  );
}

export default Form;
