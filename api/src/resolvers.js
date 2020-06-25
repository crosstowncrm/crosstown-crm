import { neo4jgraphql } from "neo4j-graphql-js";
const resolvers = {

    Query: {
        client:async (object, params, ctx, resolveInfo)=>{
            const result = await neo4jgraphql(object, params, ctx, resolveInfo, true)
            return result
        },
        getClient:async(object, params, ctx, resolveInfo)=>{
            const result = await neo4jgraphql(object, params, ctx, resolveInfo, true)
            return result
        }
    }
};

export default resolvers;