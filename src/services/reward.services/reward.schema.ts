import { t } from 'elysia';

export const personalMissionSchema = {
	headers: t.Object({
		authorization: t.String()
	}),
	body: t.Object({
		name: t.String(),
		description: t.String(),
		requirement: t.Object({
			criteria: t.Object({
				type: t.Union([
					t.Literal("uniqueSongs"),
					t.Literal("score")
				]),
				value: t.Number(),
				description: t.String(),
				reward: t.Object({
					name: t.String(),
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
					amount: t.Number()
				})
			})
		})
	})
};