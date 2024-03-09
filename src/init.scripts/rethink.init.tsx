//** RETHINK DB
import rt from "rethinkdb";
import { getRethinkDB } from "../db/rethink";
import { hash } from "bcrypt-ts";
import { NewUser } from "../services/user.services/interface";

// Replace this array with your actual data
const tableNames: string[] = ['users', 'cardsMinted', 'cardsListed', 'bundleMinted', 'bundleListed', 'chat', 'contracts', 'notifications']

const createDatabaseAndTables = async (): Promise<void> => {
  try {

    const connection: rt.Connection = await getRethinkDB();
    const tableOptions: rt.TableOptions = {
      primary_key: 'username', // Replace 'your_primary_key' with the desired primary key
    };

    // Create the 'beats' database
    await rt.dbCreate('admin').run(connection)

    // Use the 'beats' database
    for (const tableName of tableNames) {
        await rt.db('admin').tableCreate(tableName, tableOptions).run(connection)
        console.log(`Table '${tableName}' created.`);
    }

    const encryptedPassword: string = await hash('maryannpielago#666', 10)
    const newUser: NewUser = { access: '0', username: 'kaetaro13', email: 'hello@gmetarave.art', encryptedPassword, registeredAt: Date.now(), userId: '0000000' }

    await rt
      .db('admin')
      .table('users')
      .insert(newUser)
      .run(connection);



    console.log('Database and tables created successfully.');

  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

// Run the function
createDatabaseAndTables();
