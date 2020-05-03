import React, { useState } from 'react'
import {
  Link
} from 'react-router-dom'
/** ui */
import {
  Grid,
  FormControl,
  InputLabel,
  Input,
  Button
} from '@material-ui/core'

const Home = () => {

  const [state, setState] = useState({
    value: '',
    roomName: ''
  })

  return (
    <Grid container spacing={3} direction="column" alignItems="center" justify="center">

      <Grid item xs={4}>
        <FormControl>
            <InputLabel htmlFor="my-input">Your name</InputLabel>
            <Input
              id="my-input"
              aria-describedby="my-helper-text"
              value={state.value}
              onChange={(e) => setState({ ...state, value: e.target.value })}
            />
        </FormControl>
      </Grid>

      <Grid item xs={12}>
        <FormControl>
          <InputLabel htmlFor="my-input">Chat room name</InputLabel>
          <Input
            id="my-input"
            aria-describedby="my-helper-text"
            value={state.roomName}
            onChange={(e) => setState({ ...state, roomName: e.target.value })}
          />
        </FormControl>
      </Grid>
      
      <Grid item xs={12}>
        <Link
          to={`/room/${state.roomName}`}
        >
          <Button
            variant="contained" 
            color="primary"
            fullWidth
          >
            Create Room
          </Button>
        </Link>
      </Grid>

    </Grid>
  )
}

export default Home