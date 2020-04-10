import { neo4jgraphql } from "neo4j-graphql-js";

const resolvers = {
    Query: {
        loginUser:(object, params, ctx, resolveInfo)=>{
            console.log('params', params);
            return neo4jgraphql(object, params, ctx, resolveInfo, true)
        }
    }
};

export default resolvers;