import styled from 'styled-components'

export const ChannelContainer = styled.div`
  display: flex;
  width: 100%;
`
export const ChannelVideo = styled.video`
  width: 20%;
  height: 100%;
`
export const ChannelPreview = styled.canvas`
  display: none;
`
export const ChannelAttendants = styled.div`
  display: flex;

  > img {
    width: 100%;
    height: auto;
  }
`

export const ChannelChat = styled.div`
  display: flex;
  position: relative;
  width: 50%;
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