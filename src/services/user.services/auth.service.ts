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
import TokenService from "./token.service";


export default class AuthService {

    public async register(userRegistrationData: UserRegistrationData): Promise<void> {
        try{
        const { access, username, email, password } = userRegistrationData
        const userId: string = nanoid()
        const encryptedPassword: string = await hash(password, SALT_ROUNDS)
        const registeredAt: number = Date.now()

        const newUser: NewUser = { access, username, email, encryptedPassword, registeredAt, userId }

        const connection: rt.Connection = await getRethinkDB();
        
        await rt.db('admin')
          .table('users')
          .insert(newUser)
          .run(connection);

        }
        catch(error: any) {
            throw error
        }
    };

    public async authenticate(userName: string, unencryptedPassword: string): Promise<AuthenticationResponse> {
        try {
            
            const tokenService: TokenService = new TokenService()
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

            return safeProperties  as AuthenticationResponse
        } 
        catch (error: any) {
        console.error("Error in authentication:", error);
        return error
        }
    }
}
