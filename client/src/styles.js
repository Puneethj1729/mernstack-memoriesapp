import {makeStyles} from '@material-ui/core/styles';
function useStyle() {
  return {
    appBar: {
      borderRadius: 15,
      margin: '30px 0',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    heading: {
      color: 'rgba(0,183,255, 1)',
      fontWeight:'normal'
    },
    image: {
      marginLeft: '15px',
    },
  };
}
export default makeStyles(useStyle);
