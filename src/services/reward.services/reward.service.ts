//** SERVICE IMPORT
import TokenService from "../security.services/token.service";

//** TYPE INTERFACE IMPORT
import { CollectionMission, PersonalMission } from "./reward.interface";

//** MONGODB IMPORT
import { MongoClient } from "mongodb";
import { mongoDBClient } from "../../db/mongodb.client";



class RewardService {
	// Create a personal mission
	public async createPersonalMission(token: string, missionData: PersonalMission) {
		const tokenService: TokenService = new TokenService();
		try {
			const username: string = await tokenService.verifyAccessToken(token);
			const client: MongoClient = await mongoDBClient.connect();
			const collection = client.db("beats").collection("personalMissions");

			const newMission = {
				...missionData,
				createdBy: username,
				createdAt: new Date(),
			};

			await collection.insertOne(newMission);

			return ({ message: "Personal mission created successfully" });
		} catch (error: any) {
			console.error("Error creating personal mission:", error);
			throw error;
		}
	}

	// Create a collection mission
	public async createCollectionMission(token: string, missionData: CollectionMission): Promise<void> {
		const tokenService: TokenService = new TokenService();
		try {
			const username: string = await tokenService.verifyAccessToken(token);
			const client: MongoClient = await mongoDBClient.connect();
			const collection = client.db("beats").collection("collectionMissions");

			const newMission = {
				...missionData,
				createdBy: username,
				createdAt: new Date(),
			};

			await collection.insertOne(newMission);
		} catch (error: any) {
			console.error("Error creating collection mission:", error);
			throw error;
		}
	}

	// Get all personal missions
	public async getPersonalMissions(): Promise<PersonalMission[]> {
		try {
			const client: MongoClient = await mongoDBClient.connect();
			const collection = client.db("beats").collection("personalMissions");

			// Fetch all personal missions
			const missions = await collection.find().toArray() as unknown as PersonalMission[];

			return missions;
		} catch (error: any) {
			console.error("Error fetching personal missions:", error);
			throw error;
		}
	}

	// Get all collection missions
	public async getCollectionMissions(): Promise<CollectionMission[]> {
		try {
			const client: MongoClient = await mongoDBClient.connect();
			const collection = client.db("beats").collection("collectionMissions");

			// Fetch all collection missions
			const missions = await collection.find().toArray() as unknown as CollectionMission[];

			return missions;
		} catch (error: any) {
			console.error("Error fetching collection missions:", error);
			throw error;
		}
	}
}

export default RewardService;
