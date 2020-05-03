/** controllers */
import homeController from '../controllers/homeController'
import roomController from '../controllers/roomController'

export default app => {

  app.get('/room/:name', roomController)
  app.get('/', homeController)
  /** 404 */
  // app.get('*', notFoundPageController)
}