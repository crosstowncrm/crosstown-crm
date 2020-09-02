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
        user:async (_, {filter, orderByMe, first, offset}, ctx)=>{
            let session = ctx.driver.session();
            const cypherQuery = `CALL db.index.fulltext.queryNodes('searchingUser', '${filter}') YIELD node 
            WITH node OPTIONAL MATCH (node)<-[:OWNS_PROSPECT]-(owner:User) RETURN node, owner 
            ORDER BY ${orderByMe} 
            SKIP ${offset} 
            LIMIT ${first};`;
            return await session.run(cypherQuery).then(
                result => {
                    const resData = result.records.map(
                        record => {
                            const owner =  record.get('owner') === null?null:record.get('owner').properties;
                            let {id, first_name, last_name, email, pswd, phone, created_at} =  record.get('node').properties;
                            return {
                                id: id,
                                first_name: first_name,
                                last_name: last_name,
                                email: email,
                                pswd: pswd,
                                phone: phone,
                                created_at: {formatted: created_at?created_at.toString():""},
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
                                created_at: {formatted: created_at?created_at.toString():""},
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

    },
    Mutation: {
        
        updateData:async (_, {nodeLabel, nodeId, contactId}, ctx)=>{
            const digest = {"User":"OWNS_PROSPECT"};
            let session = ctx.driver.session();
            const cypherQuery = `MATCH (:${nodeLabel})-[r]-(contact:Contact {id: "${contactId}"}) DELETE r WITH contact MATCH (node:${nodeLabel} {id: "${nodeId}"}) MERGE (contact)<-[rel:${digest[nodeLabel]}]-(node) RETURN id(rel) as rel_id LIMIT 1`;
            return await session.run(cypherQuery).then(
                result => {
                    const resData = result.records[0].get('rel_id').properties;
                    return resData;
                }
            )
        },
        addressChange:async (_, {from, postal_code, street_address1, street_address2, lat, lng}, ctx)=>{
            let session = ctx.driver.session();
            const cypherQuery = `MATCH (contact:Contact {id: "${from}"}) OPTIONAL MATCH (:Address)-[r]->(contact) DELETE r WITH contact MERGE (address:Address{postal_code: "${postal_code}", street_address1: "${street_address1}", street_address2: "${street_address2}"}) ON CREATE SET address.lat = "${lat}", address.lng = "${lng}"  MERGE (contact)-[rel:HAS_ADDRESS]-(address) SET address.id=toString(id(address)) RETURN id(rel) as rel_id LIMIT 1`;
            return await session.run(cypherQuery).then(
                result => {
                    const resData = result.records[0]?result.records[0].get('rel_id').properties:null;
                    return resData;
                }
            )
        },
        createContact:async (_, params, ctx)=>{
            const {address} = params;
            delete params.address;
            let session = ctx.driver.session();
            let set = [];
            for (const [key, value] of Object.entries(params)) {
                set.push(`contact.${key} = "${value?value:""}"`);
            }
            set.push(`contact.id = toString(id(contact))`);


            const cypherQuery = `MATCH (user:User{id:"1"}) MERGE (address:Address{postal_code: "${address.postal_code?address.postal_code:""}", street_address1: "${address.street_address1}", street_address2: "${address.street_address2?address.street_address2:""}"}) ON CREATE SET address.lat = "${address.lat?address.lat:""}", address.lng = "${address.lng?address.lng:""}" CREATE (contact:Contact) SET ` + set.toString() + ` SET contact.created_at=date(), contact.last_modified=datetime(), address.id=toString(id(address)) MERGE (user)-[:OWNS_PROSPECT]->(contact) MERGE (contact)-[:HAS_ADDRESS]->(address) RETURN contact LIMIT 1`;
            return await session.run(cypherQuery).then(
                result => {
                    return result.records[0].get('contact').properties;
                }
            )
        },
        updateContact:async (_, {field, value, contactId}, ctx)=>{
            let session = ctx.driver.session();
            const cypherQuery = `MATCH (contact:Contact {id: "${contactId}"}) SET ` + field + `= "${value}" RETURN contact LIMIT 1`;
            return await session.run(cypherQuery).then(
                result => {
                    const resData = result.records[0].get('contact').properties;
                    return resData;
                }
            )
        },
        deleteContact:async (_, params, ctx)=>{
            const {contactId} = params;
            let session = ctx.driver.session();
            const cypherQuery = `MATCH (contact:Contact{id:"${contactId}"}) DETACH DELETE contact`;
            return await session.run(cypherQuery).then(
                result => {
                    return true;
                }
            )
        },
        
        createUser:async (_, params, ctx)=>{
            const {address} = params;
            delete params.address;
            let session = ctx.driver.session();
            let set = [];
            for (const [key, value] of Object.entries(params)) {
                set.push(`user.${key} = "${value?value:""}"`);
            }
            set.push(`user.id = toString(id(user))`);


            const cypherQuery = `MATCH (owner:User{id:"1"}) MERGE (address:Address{postal_code: "${address.postal_code?address.postal_code:""}", street_address1: "${address.street_address1}", street_address2: "${address.street_address2?address.street_address2:""}"}) ON CREATE SET address.lat = "${address.lat?address.lat:""}", address.lng = "${address.lng?address.lng:""}" CREATE (user:User) SET ` + set.toString() + ` SET user.created_at=date(), user.last_modified=datetime(), address.id=toString(id(address)) MERGE (owner)-[:OWNS_PROSPECT]->(user) MERGE (user)-[:HAS_ADDRESS]->(address) RETURN user LIMIT 1`;
            return await session.run(cypherQuery).then(
                result => {
                    return result.records[0].get('user').properties;
                }
            )
        },
        updateUser:async (_, {field, value, userId}, ctx)=>{
            let session = ctx.driver.session();
            const cypherQuery = `MATCH (user:User {id: "${userId}"}) SET ` + field + `= "${value}" RETURN user LIMIT 1`;
            return await session.run(cypherQuery).then(
                result => {
                    const resData = result.records[0].get('user').properties;
                    return resData;
                }
            )
        },
        deleteUser:async (_, params, ctx)=>{
            const {userId} = params;
            let session = ctx.driver.session();
            const cypherQuery = `MATCH (user:User{id:"${userId}"}) DETACH DELETE user`;
            return await session.run(cypherQuery).then(
                result => {
                    return true;
                }
            )
        },
    }
};

export default resolvers;