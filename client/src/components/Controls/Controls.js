import React, {useState, useEffect} from 'react'
import PropTypes from 'prop-types'

/** style */
import * as El from './Controls.style'
/** components */
import {
  Button,
  BottomNavigation,
  BottomNavigationAction,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton
} from '@material-ui/core'
/** icons */
import VideocamIcon from '@material-ui/icons/Videocam'
import VideocamOffIcon from '@material-ui/icons/VideocamOff'

import ChatIcon from '@material-ui/icons/Chat'
import CallEndIcon from '@material-ui/icons/CallEnd'

import MicIcon from '@material-ui/icons/Mic'
import MicOffIcon from '@material-ui/icons/MicOff'

import SendIcon from '@material-ui/icons/Send'

const Controls = () => {
  const [micState, setMicState] = useState({
    status: true,
    title: 'Mute'
  })
  const [camState, setCamState] = useState({
    status: true,
    title: 'Camera'
  })
  const [chatState, setChatState] = useState({
    status: false,
    messageText: ''
  })

  const disabledMedia = type => {
    console.log('< MUTE MICRIPHONE > ')
    window.midiaControls.mute(type)
  }

  // const sendEvent = () => {
    // console.log('< SEND EVENT > ', socket)

    // socket.emit('chat-message', socket.id, String(window.location.pathname), `${ document.getElementById('message-input').value }`)

    // document.getElementById('message-input').value = ''
  // }

  const handleBarClick = type => {
    const options = {
      'chat': () => {

      }
    }

    if (typeof options[type] === 'function') options[type]()
  }

  return (
    <El.ControlsContainer>

      {/* <El.ChannelChat>
        <ul id="messages"></ul>
        <El.ActionChat>
          <input 
            id="message-input"
          />
          <button onClick={() => sendEvent()}>Send</button>
        </El.ActionChat>
      </El.ChannelChat> */}
      <El.ControlsChat>
        <ul></ul>
        <form onKeyDown={e => {
          if (e.key === 'Enter') {
              e.preventDefault()
              /** send to socket here */
              setChatState({...chatState, messageText: ''})
            }
          }}
        >
          <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Mensagem</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={'text'}
              value={chatState.messageText}
              onChange={e => setChatState({ ...chatState, messageText: e.target.value}) }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => {
                      /** send to socket here */
                      setChatState({...chatState, messageText: ''})
                    }}
                    edge="end"
                  >
                    {<SendIcon />}
                    {/* {values.showPassword ? <Visibility /> : <VisibilityOff />} */}
                  </IconButton>
                </InputAdornment>
              }
              labelWidth={70}
            />
          </FormControl>
        </form>
      </El.ControlsChat>
      
      <BottomNavigation
        showLabels
      >
        <BottomNavigationAction onClick={() => handleBarClick('mic')} label="Mute" icon={<MicIcon />} />
        <BottomNavigationAction onClick={() => handleBarClick('cam')} label="Cam" icon={<VideocamIcon />} />
        <BottomNavigationAction onClick={() => handleBarClick('end')} label="End" icon={<CallEndIcon />} />
        <BottomNavigationAction onClick={() => handleBarClick('chat')} label="Chat" icon={<ChatIcon />} />
      </BottomNavigation>
    </El.ControlsContainer>
  )
}

Controls.propTypes = {
  socket: PropTypes.object
}

export default Controls