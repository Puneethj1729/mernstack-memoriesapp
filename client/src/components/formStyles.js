import {makeStyles} from '@material-ui/core/styles';

export default makeStyles (theme => ({
  
  textfield:{
      margin:theme.spacing (0.5),
  },
  paper: {
    padding: theme.spacing (2),
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    
  },
  fileInput: {
    width: '97%',
    margin: '10px 0',
  },
  buttonSubmit: {
    marginBottom: 10,
  },
}));
