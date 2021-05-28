import React,{useState} from 'react';
import { Container, Grow, Grid } from '@material-ui/core';
import Posts from './Posts';
import Form from './Form';
function Home() {
  const [currentId, setCurrentId] = useState(null);
  return (
    <Grow in>
      <Container>
        <Grid
          container
          justify='space-between'
          alignItems='stretch'
          spacing={3}>
          <Grid item xs={12} sm={8}>
            <Posts Id={currentId} setCurrentId={setCurrentId} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Form Id={currentId} setCurrentId={setCurrentId} />
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
}
export default Home;
