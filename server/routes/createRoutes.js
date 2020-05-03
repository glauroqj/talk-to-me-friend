/** controllers */
import roomController from '../controllers/roomController'

export default app => {
  app.get('/', roomController)

  /** 404 */
  // app.get('*', notFoundPageController)
}