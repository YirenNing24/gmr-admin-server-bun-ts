//** ERROR VALIDATION IMPORT
import ValidationError from "../../errors/validation.error";

//** RETHINKDB IMPORT
import rt from 'rethinkdb';
import { getRethinkDB } from "../../db/rethink";

//** CONFIG IMPORTS
import { SALT_ROUNDS } from "../../config/constants";

//** NANOID IMPORT
import { nanoid } from "nanoid";

//** BCRYPT IMPORT
import { compare, hash } from 'bcrypt-ts';

//** INTERFACE IMPORTS
import { AuthenticationResponse, NewUser, UserProperties, UserRegistrationData } from "./interface";
import { TokenScheme } from "./user.service.interface";

//**  SERVICE IMPORTS
import TokenService from "../security.services/token.service";
import NotificationService from "../notification.services/notification.service";
import { Notification } from "../notification.services/notification.interface";
import { SuccessMessage } from "../mint.services/mint.interface";


export default class AuthService {

    public async register(userRegistrationData: UserRegistrationData, token: string): Promise<SuccessMessage> {
        try{
        
        const tokenService: TokenService = new TokenService();
        const notificationServce: NotificationService = new NotificationService()


        const userName: string = await tokenService.verifyAccessToken(token)

        if (userName !== "kaetaro13") {
            throw new ValidationError("Unauthorized", "Unauthorized")
        }

        const { access, username, email, password } = userRegistrationData as UserRegistrationData
        const userId: string = nanoid()
        const encryptedPassword: string = await hash(password, SALT_ROUNDS)
        const registeredAt: number = Date.now()

        const newUser: NewUser = { access, username, email, encryptedPassword, registeredAt, userId }

        const connection: rt.Connection = await getRethinkDB();
        
        await rt.db('admin')
          .table('users')
          .insert(newUser)
          .run(connection);

          const notification: Notification = {
            username,
            eventType: "registration",
            eventDescription: `${username} has been registered`,
            success: true,
            errorMessage: "",
            blockchainTransactionId: ""
        }


        await notificationServce.insertNotification(notification)
       

        return { success: "User successfully registered" }


        }
        catch(error: any) {
            throw error
        }
    };

    public async authenticate(userName: string, unencryptedPassword: string): Promise<AuthenticationResponse | Error> {
        try {
            
            const tokenService: TokenService = new TokenService()
            const notificationServce: NotificationService = new NotificationService()
            // Open a new connection
            const connection: rt.Connection = await getRethinkDB();

            const query: object | null = await rt.db('admin')
            .table('users')
            .get(userName)
            .run(connection);

            if (query === null) {
                throw new ValidationError('User not found', 'User not found');
            }

            const { access, username, email, encryptedPassword, registeredAt, userId } = query as NewUser
            
            const correct: boolean = await compare(unencryptedPassword, encryptedPassword);
            if (!correct) {
                 throw new ValidationError('Incorrect password', 'Incorrect password');
            }

            const tokens: TokenScheme = await tokenService.generateTokens(userName);
            const { refreshToken, accessToken } = tokens as TokenScheme
  
            // Return User Details 
            const safeProperties: UserProperties = {
                 admin: access,
                 userId,
                 username,
                 email,
                 registeredAt,
                 refreshToken,
                 accessToken,
            };

            const notification: Notification = {
                username,
                eventType: "status",
                eventDescription: `online`,
                success: true,
                errorMessage: "",
                blockchainTransactionId: ""
            }


            await notificationServce.insertNotification(notification)
            return safeProperties  as AuthenticationResponse
        } 
        catch (error: any) {
        return error
        }
    };
}
