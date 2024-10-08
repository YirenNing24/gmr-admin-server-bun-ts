//** ELYSIA IMPORTS
import app from "../../app";
import { ElysiaWS } from "elysia/ws";

//** RETHINK DB
import rt from "rethinkdb";
import { getRethinkDB } from "../../db/rethink";

//** TYPE INTERFACE
import { Notification } from "./notification.interface";

//** SERVICE IMPORT
import TokenService from "../security.services/token.service";


class NotificationService {
websocket?: ElysiaWS<any>;
constructor(websocket?: ElysiaWS<any>) {
    this.websocket = websocket;
    }

        public async getNotification(token: string): Promise<void> {
            try{
                const tokenService: TokenService = new TokenService();
                await tokenService.verifyAccessToken(token)
        
                const connection: rt.Connection = await getRethinkDB();
                let query: rt.Sequence = rt.db('admin').table("notifications");
                    query.changes().run(connection, (error, cursor) => {
                    if (error) throw error;
                    cursor.each((error, row) => {
                        if (error) throw error;
                        if (row.new_val) {
                        const notifNewVal: Notification = row.new_val;
                        const notifData: string = JSON.stringify(notifNewVal);
                        app.server?.publish('notifications', notifData)
                        }
                    })
                    });


            } catch(error: any) {
            throw error

            }

        };

        public async insertNotification(notification: Notification): Promise<void> {
            try{
                const connection: rt.Connection = await getRethinkDB();
                await rt.db('admin')
                .table('notifications')
                .insert({ ...notification, ts: Date.now() })
                .run(connection);

            } catch(error: any) {
            throw error
            }
        };

}

export default NotificationService