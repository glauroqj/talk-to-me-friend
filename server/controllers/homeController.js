import path from 'path'
/** view */
const Html =  path.join(__dirname, '../../client/build', 'index.html')

export default (req, res) => {
  console.log('< HOME CONTROLLER > ')
  res.status(200).sendFile(Html)
}