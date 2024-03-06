//** ELYSIA IMPORT
import Elysia from 'elysia';

//** SCHEMA AND TYPE INTEFACE IMPORT
import { adminLoginSchema } from "./route.schema/auth.schema";
import { Authentication, AuthenticationResponse } from "../services/user.services/interface";

//** AUTH SERVICE IMPORT
import AuthService from "../services/user.services/auth.service";

const auth = (app: Elysia): void => {

    app.post('/admin/login/', async ({ body }): Promise<AuthenticationResponse | Error> => {
      try {
        const { username, password } = body as Authentication

        const authService: AuthService = new AuthService()
        const output: AuthenticationResponse = await authService.authenticate(username, password)

        return output as AuthenticationResponse 
      } catch (error: any) {
        throw error
        } 
      }, adminLoginSchema
    );


    app.post('/admin/validate/session', async ({ body }): Promise<AuthenticationResponse | Error> => {
      try {
        const { username, password } = body as Authentication

        const authService: AuthService = new AuthService()
        const output: AuthenticationResponse = await authService.authenticate(username, password)

        return output as AuthenticationResponse 
      } catch (error: any) {
        throw error
        } 
      }, adminLoginSchema
    );



    
  };
  
  export default auth;
  