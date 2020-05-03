import path from 'path'
/** view */
const Html =  path.join(__dirname, '../views/index.html')

export default (req, res) => {

  res.status(200).sendFile(Html)
}