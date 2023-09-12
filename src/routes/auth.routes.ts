import Elysia from "elysia";
import { cookie } from '@elysiajs/cookie'
import { getDriver } from '../db/memgraph';
import { Driver } from 'neo4j-driver-core'
import AuthService from "../services/auth.service";


interface Authentication {
    username: string;
    password: string;
}

interface AuthenticationResponse {
    safeProperties: {
        admin: string;
        userId: string;
        username: string;
    };
    success: string;
}

const auth = (app: Elysia) => {

    app.put('/admin/login/', async (context) => {
      try {
        
        const { username, password } = context.body as Authentication;

        const driver: Driver = getDriver();
        const authService: AuthService = new AuthService(driver);
        const output: AuthenticationResponse = await authService.authenticate(username, password) as AuthenticationResponse

        return output as AuthenticationResponse
      } catch (error) {
        return error
      } 
    });

    
  };
  
  export default auth;
  