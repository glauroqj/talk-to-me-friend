import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

/** style */
import * as El from './Channels.style'
/** components */
import Loading from '../Loading/Loading'
import Controls from '../Controls/Controls'
import { Button } from '@material-ui/core'
/** notification */
import { toast } from 'react-toastify'

window.connection = {}
window.userIdLocal = null

const Channel = ({socket}) => {
  let checkAgain = null

  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState([])
  const [error, setError] = useState(false)

  useEffect(() => {
    if (socket && socket.connected) {
      console.log('< SOCKET CONNECTED > ', socket)
      handleConnection()
    }
    if (socket && socket.disconnected) {
      console.log('< SOCKET NOT CONNECTED > ', socket)
      setError(true)
      setIsLoading(false)
    }
  }, [socket])

  const handleConnection = async () => {
    const isRTCLoaded = await externalLibIsLoaded('rtc')
    const isIOLoaded = await externalLibIsLoaded('io')
    console.log('< CHECK LIB > ', isRTCLoaded, isIOLoaded)
    if (!isRTCLoaded || !isIOLoaded) return false

    const RTCMultiConnection = window.RTCMultiConnection
    const connection = new RTCMultiConnection()
    connection.socketURL = 'https://rtcmulticonnection.herokuapp.com:443/'
    connection.session = {
      audio: true,
      video: true
    }
    connection.sdpConstraints.mandatory = {
        OfferToReceiveAudio: true,
        OfferToReceiveVideo: true
    }
    connection.mediaConstraints = {
      video: {
        width: {ideal: 1280},
        height: {ideal: 720},
        frameRate: 30
      },
      audio: true
    }
    connection.iceServers = [{
      'urls': [
          'stun:stun.l.google.com:19302',
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
          'stun:stun.l.google.com:19302?transport=udp',
      ]
    }]

    connection.onstream = event => {
      console.log('< ON STREAM > ', event)

      let checkElement = document.getElementById(`attendant-${event.streamid}`)

      if (checkElement) {
        /** duplicated element */
        checkElement.remove()
      }

      event.mediaElement.removeAttribute('src')
      event.mediaElement.removeAttribute('srcObject')
      event.mediaElement.muted = true
      event.mediaElement.volume = 0

      let video = document.createElement('video')
      video.setAttribute('id', `attendant-${event.streamid}`)
      video.setAttribute('class', 'animated fadeIn')

      try {
        video.setAttributeNode(document.createAttribute('autoplay'))
        video.setAttributeNode(document.createAttribute('playsinline'))
      } catch (e) {
        video.setAttribute('autoplay', true)
        video.setAttribute('playsinline', true)
      }

      if (event.type === 'local') {
        window.userIdLocal = event.streamid
        video.volume = 0
        
        try {
          video.setAttributeNode(document.createAttribute('muted'))
        } catch (e) {
          video.setAttribute('muted', true)
        }
      }
      
      document.getElementById('attendants').appendChild( video )

      /** update users */
      const userArrays = connection.streamEvents.selectAll()
      setUsers(userArrays)
      
      
      setTimeout(() => {
        setIsLoading(false)
        video.srcObject = event.stream
      }, 300)
    }

    connection.onstreamended = event => {
      let checkElement = document.getElementById(`attendant-${event.streamid}`)
      if (checkElement) {
        checkElement.remove()
        
        /** update users */
        setTimeout(() => {
          toast.warn(`${event.streamid} saiu`)
          const userArrays = connection.streamEvents.selectAll()
          setUsers(userArrays)
        }, 500)
      }
    }

    connection.onMediaError = e => {
      console.warn('< ERROR > ', e)
      if (e.message === 'Concurrent mic process limit.') {
        connection.join(connection.sessionid)
      }
    }

    connection.openOrJoin(window.location.pathname)
    console.log('< connection > ', connection )
    window.connection = connection
  }

  const externalLibIsLoaded = (name) => (
    new Promise(resolve => {
      // const isArrayEmpty = Object.keys( window.externalLib ).length
      console.log('< external name > ', name)
      if ( window.externalLib[name] ) resolve(true)
      
      if ( !window.externalLib[name] ) {
        let count = 0
        checkAgain = setInterval(() => {
          
          if ( !window.externalLib[name] && count >= 5 ) {
            clearInterval(checkAgain)
            resolve(false)
          }

          if ( window.externalLib[name] ) {
            clearInterval(checkAgain)
            resolve(true)
          }

          count++
        }, 1000)
      }

    })
  )

  return (
    <El.ChannelContainer>
      
      {isLoading && (
        <El.ChannelLoading className="animated fadeIn">
          <Loading text="Loading room..." />
        </El.ChannelLoading>
      )}

      {error && (
        <El.ChannelError className="animated fadeIn">
          <h4>Something got wrong, reload page, please!</h4>
          <Button 
            variant="contained"
            color="secondary"
            onClick={() => window.location.reload() }
          >
            Reload Page
          </Button>
        </El.ChannelError>
      )}

      <El.ChannelAttendants id="attendants" />

      {socket && socket.connected && (
        <Controls
          socket={socket}
          users={users}
        />
      )}
    </El.ChannelContainer>
  )
}

Channel.propTypes = {
  socket: PropTypes.object
}

export default Channel

/*
https://rtcmulticonnection.herokuapp.com/demos/
*/