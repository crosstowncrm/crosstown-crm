import { neo4jgraphql } from "neo4j-graphql-js";
const resolvers = {

    Query: {
        client:(object, params, ctx, resolveInfo)=>{
            console.log('ctx', ctx);
            return neo4jgraphql(object, params, ctx, resolveInfo, true)
        }
    }
};

export default resolvers;