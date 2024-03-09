//** ELYSIA IMPORT
import Elysia from "elysia";

//** CONFIG IMPORT
import ValidationError from "../errors/validation.error";

//** NOTIFCATION SERVICE
import NotificationService from "../services/notification.services/notification.service";

const notifications = (app: Elysia): void => {
  app.ws('/admin/ws', {
    async open(ws) {
      try {
        const authorizationHeader: string = ws.data.headers.authorization || "";

        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
          throw new ValidationError('jwt issue', '');
        }

        const jwtToken: string = authorizationHeader.substring(7);

        //@ts-ignore
        const notificationService: NotificationService = new NotificationService(ws);
        await notificationService.getNotification(jwtToken)
        ws?.subscribe('notifications');
      } catch (error: any) {
        throw error;
      }
    },
  });
};

export default notifications