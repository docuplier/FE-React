import { InMemoryCache, makeVar } from '@apollo/client';

export const loggedInUserSelectedRoleVar = makeVar(null);

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        questions: {
          keyArgs: false,

          merge(existing, incoming, { args: { offset, limit } }) {
            let questions = existing ? [...existing.results] : [];

            return {
              cursor: getCursor(incoming.totalCount, offset, limit),
              totalCount: incoming.totalCount,
              results: [...incoming.results, ...questions],
            };
          },

          read(existing) {
            if (existing) {
              return {
                cursor: existing.cursor,
                totalCount: existing.totalCount,
                results: existing.results,
              };
            }
          },
        },
      },
    },
  },
});

const getCursor = (totalCount, offset, limit) => {
  const numPages = Math.ceil(totalCount / limit);

  if (offset + 1 === numPages) {
    return null;
  }
  return offset + 1;
};
