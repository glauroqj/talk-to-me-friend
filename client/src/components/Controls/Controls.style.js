import styled from 'styled-components'

export const ControlsContainer = styled.div`
  display: flex;
  width: 100%;
  position: fixed;
  bottom: 0;
  z-index: 9;

  > div {
    width: 100%;
    border-top: 1px solid #cecece;
  }
`
export const ChatContainer = styled.div`
  display: flex;
  background: #f1f1f1;
  width: 400px;
  position: absolute;
  right: 0;
  height: 100vh;
  z-index: 8;

  // 640px
  @media( max-width: 640px ) {
    max-width: 100%;
  }
`
export const ControlsChat = styled.div`
  display: flex;
  width: 100%;
  flex-flow: column nowrap;

  > ul {
    height: auto;
    overflow-y: auto;
    padding-bottom: 100px;
  }

  .form-message {
    position: absolute;
    bottom: 55px;
    width: 100%;
    background-color: #fff;
  }
`
export const ControlsChatActions = styled.div`

`