import path from 'path'
/** view */
const Html =  path.join(__dirname, '../../client/build', 'index.html')

export default (req, res) => {
  // app.use( express.static(path.join(__dirname, '../../client/build')) )
  console.log('< ROOM CONTROLLER > ', Html)
  res.status(200).sendFile(Html)
}