import styled from 'styled-components'

export const ChannelContainer = styled.div`
  display: flex;
  width: 100%;
`
export const ChannelAttendants = styled.div`
  display: flex;
  width: 80%;
  flex-flow: row wrap;

  video {
    width: 50%;
    height: auto;
  }
`

export const ChannelChat = styled.div`
  display: flex;
  position: relative;
  width: 20%;
`
export const ActionChat = styled.div`
  display: flex;
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 40px;

  input {
    width: 100%;
  }
`