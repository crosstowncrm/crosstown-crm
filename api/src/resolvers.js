import { neo4jgraphql } from "neo4j-graphql-js";
const resolvers = {

    Query: {
        client:async (object, params, ctx, resolveInfo)=>{
            const result = await neo4jgraphql(object, params, ctx, resolveInfo, true);
            return result
        },
        company:async (_, {filter, orderByMe, first, offset}, ctx)=>{
            let session = ctx.driver.session();
            const cypherQuery = `CALL db.index.fulltext.queryNodes('searchCompany', '${filter}') YIELD node 
            WITH node OPTIONAL MATCH (node)<-[:OWNS_PROSPECT]-(owner:User) RETURN node, owner 
            ORDER BY ${orderByMe} 
            SKIP ${offset} 
            LIMIT ${first};`;
            return await session.run(cypherQuery).then(
                    result => {
                    const resData = result.records.map(
                        record => {
                            const owner =  record.get('owner') === null?null:record.get('owner').properties;
                            let {id, name, employees_num, lead_status, phone, created_at} =  record.get('node').properties;
                            return {
                                id: id,
                                name: name,
                                employees_num: employees_num,
                                lead_status: lead_status,
                                phone: phone,
                                created_at: {formatted: created_at.toString()},
                                owner: owner===null? null: {
                                    first_name: owner.first_name,
                                    last_name: owner.last_name
                                }
                            };
                        }
                    )
                    return resData;
                }
            )
        },
        contact:async (_, {filter, orderByMe, first, offset}, ctx)=>{
            let session = ctx.driver.session();
            const cypherQuery = `CALL db.index.fulltext.queryNodes('searchingContact', '${filter}') YIELD node 
            WITH node OPTIONAL MATCH (node)<-[:OWNS_PROSPECT]-(owner:User) RETURN node, owner 
            ORDER BY ${orderByMe} 
            SKIP ${offset} 
            LIMIT ${first};`;
            return await session.run(cypherQuery).then(
                result => {
                    const resData = result.records.map(
                        record => {
                            const owner =  record.get('owner') === null?null:record.get('owner').properties;
                            let {id, first_name, last_name, email, lead_status, phone, created_at} =  record.get('node').properties;
                            return {
                                id: id,
                                first_name: first_name,
                                last_name: last_name,
                                email: email,
                                lead_status: lead_status,
                                phone: phone,
                                created_at: {formatted: created_at.toString()},
                                owner: owner===null? null: {
                                    first_name: owner.first_name,
                                    last_name: owner.last_name
                                }
                            };
                        }
                    );
                    return resData;
                }
            )
        },
        getClient:async(object, params, ctx, resolveInfo)=>{
            const result = await neo4jgraphql(object, params, ctx, resolveInfo, true);
            return result
        },

        getClientCount:async(object, params, ctx, resolveInfo)=>{
            const result = await neo4jgraphql(object, params, ctx, resolveInfo, true);
            return result
        },

        getDealCount:async(object, params, ctx, resolveInfo)=>{
            const result = await neo4jgraphql(object, params, ctx, resolveInfo, true);
            return result
        },

        getListingCount:async(object, params, ctx, resolveInfo)=>{
            const result = await neo4jgraphql(object, params, ctx, resolveInfo, true);
            return result
        },

        getPropertyCount:async(object, params, ctx, resolveInfo)=>{
            const result = await neo4jgraphql(object, params, ctx, resolveInfo, true);
            return result
        },

        getUserCount:async(object, params, ctx, resolveInfo)=>{
            const result = await neo4jgraphql(object, params, ctx, resolveInfo, true)
            return result
        }

    }
};

export default resolvers;