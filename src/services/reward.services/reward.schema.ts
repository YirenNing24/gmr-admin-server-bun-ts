import { t } from 'elysia';

export const personalMissionSchema = {
	headers: t.Object({
		authorization: t.String()
	}),
	body: t.Object({
		name: t.String(),
		missionType: t.Literal("personal"),
		description: t.String(),
		requirement: t.Object({
			criteria: t.Object({
				type: t.Union([
					t.Literal("uniqueSongs"),
					t.Literal("score")
				]),
				value: t.Number(), //how many score or songs to achieve
				group: t.Optional(t.String()), // Optional field for specific groups
				description: t.String(),
				reward: t.Object({
					name: t.String(),
					cards: t?.Array(t.String()),
					beats: t?.Number(),
					amount: t.Number()
				})
			})
		})
	})
};


export const collectionMissionSchema = {
	headers: t.Object({
		authorization: t.String()
	}),
	body: t.Object({
		name: t.String(),
		missionType: t.Literal("collection"),
		description: t.String(),
		requirement: t.Object({
			criteria: t.Object({
				type: t.Union([
					t.Literal("random"),
					t.Literal("specificGroup")
				]),
				value: t.Number(),
				group: t.Optional(t.String()), // Optional field for specific groups
				description: t.String(),
				reward: t.Object({
					name: t.String(),
					cards: t?.Array(t.String()),
					beats: t?.Number(),
					amount: t.Number()
				})
			})
		})
	})
};