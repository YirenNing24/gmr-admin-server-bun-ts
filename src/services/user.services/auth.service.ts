//** ERROR VALIDATION IMPORT
import ValidationError from "../../errors/validation.error";

//** MONGO DB IMPORTS
import { mongoDBClient } from '../../db/mongodb.client';
import { MongoClient } from 'mongodb';

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
import { SuccessMessage } from "../mint.services/mint.interface";


class AuthService {
    public async register(userRegistrationData: UserRegistrationData, token: string): Promise<SuccessMessage> {
        const client: MongoClient = await mongoDBClient.connect();
        try{
        const tokenService: TokenService = new TokenService();
        const userName: string = await tokenService.verifyAccessToken(token)

        if (userName !== "kaetaro13") {
            throw new ValidationError("Unauthorized", "Unauthorized")
        }

        const { access, username, email, password } = userRegistrationData as UserRegistrationData
        const userId: string = nanoid();
        const encryptedPassword: string = await hash(password, SALT_ROUNDS);
        const registeredAt: number = Date.now();

        const newUser: NewUser = { access, username, email, encryptedPassword, registeredAt, userId }

        const collection = client.db("admin").collection("users");
        await collection.insertOne(newUser);

        return { success: "User successfully registered" };
        }
        catch(error: any) {
            throw error
        } finally {
            if (client) {
                await client.close(); // Ensure the MongoDB client is closed
            }
        }
    };


    public async authenticate(username: string, unencryptedPassword: string): Promise<AuthenticationResponse | Error> {
        const client: MongoClient = await mongoDBClient.connect();
        const tokenService: TokenService = new TokenService();
        try {

            const collection = client.db("admin").collection("users");
            const result = await collection.findOne({ username }) as unknown as NewUser

    
            if (result === null) {
                throw new ValidationError('User not found', 'User not found');
            }
    
            const { access, email, encryptedPassword, registeredAt, userId } = result;
    
            // Compare passwords
            const correct: boolean = await compare(unencryptedPassword, encryptedPassword);
            if (!correct) {
                throw new ValidationError('Incorrect password', 'Incorrect password');
            }
    
            // Generate tokens
            const tokens: TokenScheme = await tokenService.generateTokens(username);
            const { refreshToken, accessToken } = tokens;
    
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
    
            // Optional: Uncomment if you want to use notifications
            // const notification: Notification = {
            //     username,
            //     eventType: "status",
            //     eventDescription: "online",
            //     success: true,
            //     errorMessage: "",
            //     blockchainTransactionId: ""
            // };
            // await notificationService.insertNotification(notification);
    
            return safeProperties as AuthenticationResponse;
        } 
        catch (error: any) {
            console.log(error);
            return error;
        } finally {
            if (client) {
                await client.close(); // Ensure the MongoDB client is closed
            }
        }
    };
    
    
}

export default AuthService