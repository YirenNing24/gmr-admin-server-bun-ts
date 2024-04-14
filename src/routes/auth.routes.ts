//** ELYSIA IMPORT
import Elysia from 'elysia';

//** SCHEMA AND TYPE INTEFACE IMPORT
import { adminLoginSchema, adminRegistrationSchema } from "../services/user.services/auth.schema";
import { authorizationBearerSchema } from '../services/contract.services/contract.schema';

import { Authentication, AuthenticationResponse, UserRegistrationData } from "../services/user.services/interface";
import { TokenScheme } from '../services/user.services/user.service.interface';

//** AUTH SERVICE IMPORT
import AuthService from "../services/user.services/auth.service";
import TokenService from '../services/security.services/token.service';
import { SuccessMessage } from '../services/mint.services/mint.interface';


const auth = (app: Elysia): void => {
    app.post('/admin/login/', async ({ body }): Promise<AuthenticationResponse | Error> => {
      try {
        const { username, password } = body as Authentication

        const authService: AuthService = new AuthService()
        const output: AuthenticationResponse | Error = await authService.authenticate(username, password)

        return output as AuthenticationResponse 
      } catch (error: any) {
        throw error
        } 
      }, adminLoginSchema
    );

    app.post('/api/renew/access', async ({ headers }): Promise<TokenScheme> => {
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            throw new Error('Bearer token not found in Authorization header');
        };

        const jwtToken: string = authorizationHeader.substring(7);
        const tokenService: TokenService = new TokenService();
        const output: TokenScheme = await tokenService.refreshTokens(jwtToken);

        return output as TokenScheme;
      } catch(error: any) {
        throw error
        }
      }, authorizationBearerSchema
    );

    app.post('/admin/register/', async ({ headers, body }): Promise<SuccessMessage> => {
      try {
        const authorizationHeader: string = headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            throw new Error('Bearer token not found in Authorization header');
        };

        const jwtToken: string = authorizationHeader.substring(7);

        const authService: AuthService = new AuthService()
        const output: SuccessMessage = await authService.register(body, jwtToken)

        return output as SuccessMessage 
      } catch (error: any) {
        throw error
        } 
      }, adminRegistrationSchema
    );




    
  };
  
  export default auth;
  