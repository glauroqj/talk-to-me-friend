import styled from 'styled-components'

export const ControlsContainer = styled.div`
  display: flex;
  width: 100%;
  position: fixed;
  bottom: 0;

  > div {
    width: 100%;
  }
`

export const ControlsChat = styled.div`
  display: flex;
  max-width: 350px;
  position: absolute;

  // 640px
  @media( max-width: 640px ) {
    max-width: 100%;
  }
`
export const ControlsChatActions = styled.div`

`