import Elysia from "elysia";
import { getDriver } from '../db/memgraph';

import { Driver } from 'neo4j-driver';
import UserService from "../services/user.services/user.service";



const user = (app: Elysia) => {

    // app.get('/admin/user/', async (context) => {
    //   try {
        
    //     const { username } = context.body as { username: string };

    //     const driver: Driver = getDriver();
    //     const authService: UserService = new UserService(driver);
    //     const output = await authService.getUserProfile(username) 

    //     return output
    //   } catch (error) {
    //     return error
    //   } 
    // });

    
  };
  
  export default user;
  