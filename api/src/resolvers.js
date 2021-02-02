import {neo4jgraphql} from "neo4j-graphql-js";
import jwt from "jsonwebtoken";

const resolvers = {

    Query: {
        getArticleById: async (_, {id}, ctx) =>{
            let session = ctx.driver.session();
            const cypherQuery = `MATCH (article:Article{id:"${id}"})-[:HAS_ELEMENT]->(element:Element) RETURN article, collect(element) as elements;`;
            return await session.run(cypherQuery).then(
                result => {
                    const resData = result.records.map(
                        record => {
                            const {id, author, headline, excerpt} = record.get('article') ? record.get('article').properties : null;
                            const elements = record.get('elements') ? record.get('elements') : null;
                            let blocks = [];
                            elements.map(element => {
                                const {id:articleId, order, text, type} = element.properties ? element.properties : null;
                                blocks = [...blocks, {type:type, data:{text: text}}];
                            });

                            return {
                                id: id,
                                author: author,
                                headline: headline,
                                excerpt: excerpt,
                                elements: blocks
                            }
                        }
                    );
                    return resData;
                }
            );
        },

        loginUser: async (_, {name, pswd}, ctx) => {
            let session = ctx.driver.session();
            const cypherQuery = `MATCH (user:User {last_name: "${name}", pswd: "${pswd}"}) OPTIONAL MATCH (user)-[:HAS_ROLE]-(role:Role) RETURN user, role LIMIT 1;`;
            return await session.run(cypherQuery).then(
                result => {
                    const resData = result.records.map(
                        record => {
                            let {id} = record.get('user').properties;
                            let {name: roleName} = record.get('role') ? record.get('role').properties : null;
                            return {
                                userId: id,
                                token: jwt.sign({
                                    userId: id,
                                    scopes: [roleName]
                                }, process.env.JWT_SECRET || "crying_robocop", {expiresIn: '5h'}),
                            }
                        }
                    );
                    return resData;
                }
            );
        },

        client: async (_, {filter, first, offset}, ctx) => {
            let session = ctx.driver.session();
            const cypherQuery = `CALL db.index.fulltext.queryNodes('searchClient', '${filter}') YIELD node 
            WITH node OPTIONAL MATCH (node)<-[:OWNS_PROSPECT]-(owner:User) RETURN node, owner 
            ORDER BY (CASE WHEN 'Company' IN labels(node) THEN node.name ELSE node.first_name END) ASC
            SKIP ${offset}
            LIMIT ${first};`;

            return await session.run(cypherQuery).then(
                result => {
                    const resData = result.records.map(
                        record => {
                            const owner = record.get('owner') === null ? null : record.get('owner').properties;
                            const client = record.get('node').properties;
                            const {id, email, lead_status, phone, created_at} = client;
                            let {name} = client;
                            let typename = "Company";
                            if (!name) {
                                const {first_name, last_name} = client;
                                name = `${first_name} ${last_name}`;
                                typename = "Contact";
                            }
                            return {
                                id: id,
                                name: name,
                                email: email,
                                lead_status: lead_status,
                                phone: phone,
                                created_at: {formatted: created_at.toString()},
                                owner: owner === null ? null : {
                                    first_name: owner.first_name,
                                    last_name: owner.last_name
                                },
                                typename: typename
                            };
                        }
                    );
                    return resData;
                }
            )
        },

        company: async (_, {filter, orderByMe, first, offset}, ctx) => {
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
                            const owner = record.get('owner') === null ? null : record.get('owner').properties;
                            let {id, name, employees_num, lead_status, phone, created_at} = record.get('node').properties;
                            return {
                                id: id,
                                name: name,
                                employees_num: employees_num,
                                lead_status: lead_status,
                                phone: phone,
                                created_at: {formatted: created_at.toString()},
                                owner: owner === null ? null : {
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

        getRole: async (_, {id}, ctx) => {
            let session = ctx.driver.session();
            const cypherQuery = `MATCH (node:Role{id:"${id}"}) OPTIONAL MATCH (user:User)-[:HAS_ROLE]->(node) RETURN node, user
            LIMIT 1;`;
            return await session.run(cypherQuery).then(
                result => {
                    const resData = result.records.map(
                        record => {
                            const user = record.get('user') === null ? null : record.get('user').properties;
                            let {id, name} = record.get('node').properties;
                            return {
                                id: id,
                                name: name,
                                assigned: user === null ? null : {
                                    id: user.id,
                                    first_name: user.first_name,
                                    last_name: user.last_name
                                },
                            };
                        }
                    );
                    return resData;
                }
            )
        },

        getTask: async (_, {id}, ctx) => {
            let session = ctx.driver.session();
            const cypherQuery = `MATCH (user:User)<-[:ASSIGNED_TO]-(node:Task{id:"${id}"})-[:ASSOCIATED_WITH]->(client) RETURN node, user, client 
            LIMIT 1;`;
            return await session.run(cypherQuery).then(
                result => {
                    const resData = result.records.map(
                        record => {
                            const user = record.get('user') === null ? null : record.get('user').properties;
                            let {id: clientId, name: clientName, first_name: clientFN, last_name: clientLN, phone: clientPhone} = record.get('client').properties;
                            let {id, title, type, priority, notes, created_at, due_date} = record.get('node').properties;
                            return {
                                id: id,
                                title: title,
                                type: type,
                                priority: priority,
                                notes: notes,
                                created_at: {formatted: created_at.toString()},
                                due_date: {formatted: due_date.toString()},
                                assigned: user === null ? null : {
                                    id: user.id,
                                    first_name: user.first_name,
                                    last_name: user.last_name
                                },
                                associated: {
                                    id: clientId,
                                    name: clientName ? clientName : `${clientFN} ${clientLN}`,
                                    typename: clientName ? `company` : `contact`,
                                    phone: clientPhone
                                }
                            };
                        }
                    );
                    return resData;
                }
            )
        },

        property: async (_, {filter, orderByMe, first, offset}, ctx) => {
            let session = ctx.driver.session();
            const cypherQuery = `CALL db.index.fulltext.queryNodes('searchProperty', '${filter}') YIELD node 
            WITH node OPTIONAL MATCH (node)<-[:ASSOCIATED_WITH]-(owner:Contact) RETURN node, owner 
            ORDER BY ${orderByMe} 
            SKIP ${offset} 
            LIMIT ${first};`;
            return await session.run(cypherQuery).then(
                result => {
                    const resData = result.records.map(
                        record => {
                            const owner = record.get('owner') === null ? null : record.get('owner').properties;
                            let {id, name, lead_status, phone, created_at} = record.get('node').properties;
                            return {
                                id: id,
                                name: name,
                                lead_status: lead_status,
                                phone: phone,
                                created_at: {formatted: created_at.toString()},
                                owner: owner === null ? null : {
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
        user: async (_, {filter, orderByMe, first, offset}, ctx) => {
            let session = ctx.driver.session();

            if (!first) first = 10;
            if (!offset) offset = 0;
            const cypherQuery = `CALL db.index.fulltext.queryNodes('searchingUser', '${filter}') YIELD node 
            WITH node OPTIONAL MATCH (node)<-[:OWNS_PROSPECT]-(owner:User) OPTIONAL MATCH (node)-[:HAS_ROLE]-(role:Role) RETURN node, owner, role 
            ORDER BY ${orderByMe} 
            SKIP ${offset} 
            LIMIT ${first};`;
            return await session.run(cypherQuery).then(
                result => {
                    const resData = result.records.map(
                        record => {
                            const owner = record.get('owner') === null ? null : record.get('owner').properties;
                            const {id, first_name, last_name, email, pswd, phone, created_at} = record.get('node').properties;
                            const role = record.get('role') === null ? null : record.get('role').properties;
                            return {
                                id: id,
                                first_name: first_name,
                                last_name: last_name,
                                email: email,
                                pswd: pswd,
                                phone: phone,
                                created_at: {formatted: created_at ? created_at.toString() : ""},
                                owner: owner === null ? null : {
                                    id: owner.id,
                                    first_name: owner.first_name,
                                    last_name: owner.last_name
                                },
                                role: role === null ? null : {
                                    id: role.id,
                                    name: role.name
                                }
                            };
                        }
                    );
                    return resData;
                }
            )
        },
        contact: async (_, {filter, orderByMe, first, offset}, ctx) => {
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
                            const owner = record.get('owner') === null ? null : record.get('owner').properties;
                            let {id, first_name, last_name, email, lead_status, phone, created_at} = record.get('node').properties;
                            return {
                                id: id,
                                first_name: first_name,
                                last_name: last_name,
                                email: email,
                                lead_status: lead_status,
                                phone: phone,
                                created_at: {formatted: created_at ? created_at.toString() : ""},
                                owner: owner === null ? null : {
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

        activity: async (_, {first, offset}, ctx) => {
            let session = ctx.driver.session();
            const cypherQuery = `MATCH (user:User)-[:OWNS_PROSPECT]-(contact:Contact)-[r]-(object)
                                    WHERE r.datetime IS NOT NULL
                                    RETURN contact, collect(r.datetime) as actionDateList, collect(type(r)) as actions, 
                                    collect(labels(object)[0]) as objects, collect(object.id) as objectIds, 
                                    max(r.datetime) as maxdate
                                    ORDER BY maxdate 
                                    SKIP ${offset} 
                                    LIMIT ${first};
                                `;
            return await session.run(cypherQuery).then(
                result => {
                    const resData = result.records.map(
                        record => {
                            const contact = record.get('contact') === null ? null : record.get('contact').properties;
                            const actionDateList = record.get('actionDateList');
                            let actionDates = [];
                            actionDateList.map(record => {
                                actionDates = [...actionDates, record.toString()];
                            });
                            const actions = record.get('actions') === null ? null : record.get('actions');
                            let acts = [];
                            actions.map(record => {
                                acts = [...acts, record.toString().toLowerCase().replace("_", " ")];
                            });
                            const objects = record.get('objects') === null ? null : record.get('objects');
                            const objectIds = record.get('objects') === null ? null : record.get('objectIds');
                            let ids = [];
                            objectIds.map(record => {
                                ids = [...ids, record.toString().toLowerCase()];
                            });

                            const last = {
                                objectId: ids.shift(),
                                action: acts.shift(),
                                date: actionDates.shift(),
                                object: objects.shift()
                            };

                            return {
                                actionDateList: actionDates,
                                actions: acts,
                                objects: objects,
                                objectIds: ids,
                                last: last,
                                contact: contact === null ? null : {
                                    id: contact.id,
                                    first_name: contact.first_name,
                                    last_name: contact.last_name
                                }
                            };
                        }
                    );
                    return resData;
                }
            )
        },

        getClientCount: async (object, params, ctx, resolveInfo) => {
            const result = await neo4jgraphql(object, params, ctx, resolveInfo, true);
            return result
        },

        getActivityCount: async (object, params, ctx, resolveInfo) => {
            const result = await neo4jgraphql(object, params, ctx, resolveInfo, true);
            return result
        },

        getDealCount: async (object, params, ctx, resolveInfo) => {
            const result = await neo4jgraphql(object, params, ctx, resolveInfo, true);
            return result
        },

        getListingCount: async (object, params, ctx, resolveInfo) => {
            const result = await neo4jgraphql(object, params, ctx, resolveInfo, true);
            return result
        },

        getPropertyCount: async (object, params, ctx, resolveInfo) => {
            const result = await neo4jgraphql(object, params, ctx, resolveInfo, true);
            return result
        },

        getUserCount: async (object, params, ctx, resolveInfo) => {
            const result = await neo4jgraphql(object, params, ctx, resolveInfo, true);
            return result
        },

    },
    Mutation: {
        addressChange: async (_, {from, postal_code, street_address1, street_address2, lat, lng, label}, ctx) => {
            let session = ctx.driver.session();
            const cypherQuery = `MATCH (unit:${label} {id: "${from}"}) OPTIONAL MATCH (:Address)-[r]->(unit) DELETE r WITH unit MERGE (address:Address{postal_code: "${postal_code}", street_address1: "${street_address1}", street_address2: "${street_address2}"}) ON CREATE SET address.lat = "${lat}", address.lng = "${lng}"  MERGE (unit)-[rel:HAS_ADDRESS]-(address) SET address.id=toString(id(address)) RETURN id(rel) as rel_id LIMIT 1`;
            return await session.run(cypherQuery).then(
                result => {
                    const resData = result.records[0] ? result.records[0].get('rel_id').properties : null;
                    return resData;
                }
            )
        },

        roleChange: async (_, {from, name, label}, ctx) => {
            let session = ctx.driver.session();
            const cypherQuery = `MATCH (unit:${label} {id: "${from}"}) OPTIONAL MATCH (:Role)<-[r:HAS_ROLE]-(unit) DELETE r WITH unit MERGE (role:Role{name: "${name}"}) MERGE (unit)-[rel:HAS_ROLE]->(role) SET role.id=toString(id(role)) RETURN id(rel) as rel_id LIMIT 1`;
            return await session.run(cypherQuery).then(
                result => {
                    const resData = result.records[0] ? result.records[0].get('rel_id').toString() : null;
                    return resData;
                }
            )
        },

        createContact: async (_, params, ctx) => {
            const {address} = params;
            delete params.address;
            let session = ctx.driver.session();
            let set = [];
            for (const [key, value] of Object.entries(params)) {
                set.push(`contact.${key} = "${value ? value : ""}"`);
            }
            set.push(`contact.id = toString(id(contact))`);

            const cypherQuery = `MATCH (user:User{id:"1"}) MERGE (address:Address{postal_code: "${address.postal_code ? address.postal_code : ""}", street_address1: "${address.street_address1}", street_address2: "${address.street_address2 ? address.street_address2 : ""}"}) ON CREATE SET address.lat = "${address.lat ? address.lat : ""}", address.lng = "${address.lng ? address.lng : ""}" CREATE (contact:Contact) SET ` + set.toString() + ` SET contact.created_at=date(), contact.last_modified=datetime(), address.id=toString(id(address)) MERGE (user)-[:OWNS_PROSPECT]->(contact) MERGE (contact)-[:HAS_ADDRESS]->(address) RETURN contact LIMIT 1`;
            return await session.run(cypherQuery).then(
                result => {
                    return result.records[0].get('contact').properties;
                }
            )
        },
        deleteContact: async (_, params, ctx) => {
            const {contactId} = params;
            let session = ctx.driver.session();
            const cypherQuery = `MATCH (contact:Contact{id:"${contactId}"}) DETACH DELETE contact`;
            return await session.run(cypherQuery).then(
                result => {
                    return true;
                }
            )
        },

        updateContact: async (_, {field, value, contactId}, ctx) => {
            let session = ctx.driver.session();
            const cypherQuery = `MATCH (contact:Contact {id: "${contactId}"}) SET ` + field + `= "${value}" RETURN contact LIMIT 1`;
            return await session.run(cypherQuery).then(
                result => {
                    const resData = result.records[0].get('contact').properties;
                    return resData;
                }
            )
        },

        updateData: async (_, {nodeLabel, nodeId, unitId, label}, ctx) => {
            const digest = {"User": "OWNS_PROSPECT"};
            let session = ctx.driver.session();
            const cypherQuery = `MATCH (unit:${label} {id: "${unitId}"}) OPTIONAL MATCH (:${nodeLabel})-[r]-(unit) DELETE r WITH unit MATCH (node:${nodeLabel} {id: "${nodeId}"}) MERGE (unit)<-[rel:${digest[nodeLabel]}]-(node) RETURN id(rel) as rel_id LIMIT 1`;
            return await session.run(cypherQuery).then(
                result => {
                    const resData = result.records[0].get('rel_id').properties;
                    return resData;
                }
            )
        },

        createUser: async (_, params, ctx) => {
            const {address} = params;
            delete params.address;
            let session = ctx.driver.session();
            let set = [];
            for (const [key, value] of Object.entries(params)) {
                set.push(`user.${key} = "${value ? value : ""}"`);
            }
            set.push(`user.id = toString(id(user))`);

            const cypherQuery = `MATCH (owner:User{id:"1"}) MERGE (role:Role{name:"agent"}) MERGE (address:Address{postal_code: "${address.postal_code ? address.postal_code : ""}", street_address1: "${address.street_address1}", street_address2: "${address.street_address2 ? address.street_address2 : ""}"}) ON CREATE SET address.lat = "${address.lat ? address.lat : ""}", address.lng = "${address.lng ? address.lng : ""}" CREATE (user:User) SET ` + set.toString() + ` SET user.created_at=date(), user.last_modified=datetime(), address.id=toString(id(address)) MERGE (owner)-[:OWNS_PROSPECT]->(user) MERGE (user)-[:HAS_ADDRESS]->(address) MERGE (user)-[:HAS_ROLE]->(role) RETURN user LIMIT 1`;
            return await session.run(cypherQuery).then(
                result => {
                    return result.records[0].get('user').properties;
                }
            )
        },

        updateUser: async (_, {field, value, userId}, ctx) => {
            let session = ctx.driver.session();
            const cypherQuery = `MATCH (user:User {id: "${userId}"}) SET ` + field + `= "${value}" RETURN user LIMIT 1`;
            return await session.run(cypherQuery).then(
                result => {
                    const resData = result.records[0].get('user').properties;
                    return resData;
                }
            )
        },
        deleteUser: async (_, params, ctx) => {
            const {userId} = params;
            let session = ctx.driver.session();
            const cypherQuery = `MATCH (user:User{id:"${userId}"}) DETACH DELETE user`;
            return await session.run(cypherQuery).then(
                result => {
                    return true;
                }
            )
        },
        createArticle: async (_, {arg}, ctx) => {
            const {headline, author, excerpt, blocks} = arg;
            let session = ctx.driver.session();
            let articleElements = [];
            let i =0;
            let push = "";
            let text = "";
            blocks.map( element => {
                const {type} = element;
                switch (type) {
                    case "header":
                        text = element.data[0].text;
                        push = "MERGE (article)-[:HAS_ELEMENT]->(:Element{id:toString(id(article))+'-header-'+" + i + ", type: 'header', text:'" + text + "', order: " + i + "})";
                        break;
                    case "delimiter":
                        push = "MERGE (article)-[:HAS_ELEMENT]->(:Element{id:toString(id(article))+'-delimiter-'+" + i + ", type: 'delimiter', text:'{}', order: " + i + "})";
                        break;
                    case "paragraph":
                        let text = element.data[0].text;
                        push = "MERGE (article)-[:HAS_ELEMENT]->(:Element{id:toString(id(article))+'-paragraph-'+" + i + ", type: 'paragraph', text:'" + text + "', order: " + i + "})";
                        break;
                    default:
                        push = null;
                        console.log(element.type, element.data.text, element.data.level);
                        break;
                }
                if (push!==null) articleElements.push(push);
                i++;
            });

            const cypherQuery = `CREATE (article:Article{headline: "` + headline + `", author: "` + author + `", excerpt: "` + excerpt + `"}) SET article.id=toString(id(article)) SET article.created_at=date(), article.last_modified=datetime()  ` + articleElements.join(" ") + ` RETURN article LIMIT 1`;
            return await session.run(cypherQuery).then(
                result => {
                    return result.records[0].get('article').properties;
                }
            )
        },
        createCompany: async (_, params, ctx) => {
            const {address} = params;
            delete params.address;
            let session = ctx.driver.session();
            let set = [];
            for (const [key, value] of Object.entries(params)) {
                set.push(`company.${key} = "${value ? value : ""}"`);
            }
            set.push(`company.id = toString(id(company))`);
            const cypherQuery = `MATCH (owner:User{id:"1"}) MERGE (address:Address{postal_code: "${address.postal_code ? address.postal_code : ""}", street_address1: "${address.street_address1}", street_address2: "${address.street_address2 ? address.street_address2 : ""}"}) ON CREATE SET address.lat = "${address.lat ? address.lat : ""}", address.lng = "${address.lng ? address.lng : ""}" CREATE (company:Company) SET ` + set.toString() + ` SET company.created_at=date(), company.last_modified=datetime(), address.id=toString(id(address)) MERGE (owner)-[:OWNS_PROSPECT]->(company) MERGE (company)-[:HAS_ADDRESS]->(address) RETURN company LIMIT 1`;
            return await session.run(cypherQuery).then(
                result => {
                    return result.records[0].get('company').properties;
                }
            )
        },
        updateCompany: async (_, {field, value, companyId}, ctx) => {
            let session = ctx.driver.session();
            const cypherQuery = `MATCH (company:Company {id: "${companyId}"}) SET ` + field + `= "${value}" RETURN company LIMIT 1`;
            return await session.run(cypherQuery).then(
                result => {
                    const resData = result.records[0].get("company").properties;
                    return resData;
                }
            )
        },
        deleteCompany: async (_, params, ctx) => {
            const {companyId} = params;
            let session = ctx.driver.session();
            const cypherQuery = `MATCH (company:Company{id:"${companyId}"}) DETACH DELETE company`;
            return await session.run(cypherQuery).then(
                result => {
                    return true;
                }
            )
        },
        createProperty: async (_, params, ctx) => {
            const {address} = params;
            delete params.address;
            let session = ctx.driver.session();
            let set = [];
            for (const [key, value] of Object.entries(params)) {
                set.push(`property.${key} = "${value ? value : ""}"`);
            }
            set.push(`property.id = toString(id(property))`);
            const cypherQuery = `MERGE (address:Address{postal_code: "${address.postal_code ? address.postal_code : ""}", street_address1: "${address.street_address1}", street_address2: "${address.street_address2 ? address.street_address2 : ""}"}) ON CREATE SET address.lat = "${address.lat ? address.lat : ""}", address.lng = "${address.lng ? address.lng : ""}" CREATE (property:Property) SET ` + set.toString() + ` SET property.created_at=date(), property.last_modified=datetime(), address.id=toString(id(address)) MERGE (property)-[:HAS_ADDRESS]->(address) RETURN property LIMIT 1`;
            return await session.run(cypherQuery).then(
                result => {
                    return result.records[0].get('property').properties;
                }
            )
        },
        updateProperty: async (_, {field, value, propertyId}, ctx) => {
            let session = ctx.driver.session();
            const cypherQuery = `MATCH (property:Property {id: "${propertyId}"}) SET ` + field + `= "${value}" RETURN property LIMIT 1`;
            return await session.run(cypherQuery).then(
                result => {
                    const resData = result.records[0].get("property").properties;
                    return resData;
                }
            )
        },
        deleteProperty: async (_, params, ctx) => {
            const {propertyId} = params;
            let session = ctx.driver.session();
            const cypherQuery = `MATCH (property:Property{id:"${propertyId}"}) DETACH DELETE property`;
            return await session.run(cypherQuery).then(
                result => {
                    return true;
                }
            )
        },

        createTask: async (_, {type, priority, title, associated, label, assigned, notes, dueDate}, ctx) => {
            let session = ctx.driver.session();
            const cypherQuery = `MATCH (client:${label}{id: "${associated}"}) MATCH (user:User{id: "${assigned}"}) CREATE (task:Task) SET task.type="${type}", task.priority="${priority}", task.created_at=datetime(), task.last_modified=datetime(), task.id=toString(id(task)), task.due_date=datetime("${dueDate}"), task.title="${title}", task.notes="${notes}" MERGE (user)<-[:ASSIGNED_TO]-(task)-[:ASSOCIATED_WITH]->(client) RETURN task LIMIT 1`;
            return await session.run(cypherQuery).then(
                result => {
                    return result.records[0].get('task').properties;
                }
            )
        },

        updateTask: async (_, {field, value, taskId}, ctx) => {
            let session = ctx.driver.session();
            const cypherQuery = `MATCH (task:Task {id: "${taskId}"}) SET ` + field + `= "${value}" RETURN task LIMIT 1`;
            return await session.run(cypherQuery).then(
                result => {
                    const resData = result.records[0].get("task").properties;
                    return resData;
                }
            )
        },

        deleteTask: async (_, params, ctx) => {
            const {taskId} = params;
            let session = ctx.driver.session();
            const cypherQuery = `MATCH (task:Task{id:"${taskId}"}) DETACH DELETE task`;
            return await session.run(cypherQuery).then(
                result => {
                    return true;
                }
            )
        },
        createRole: async (_, {name}, ctx) => {
            let session = ctx.driver.session();
            const cypherQuery = `MERGE (role:Role{name: "${name}"}) SET role.id=toString(id(role)) RETURN role LIMIT 1`;
            return await session.run(cypherQuery).then(
                result => {
                    return result.records[0].get('role').properties;
                }
            )
        },

        updateRole: async (_, {field, value, roleId}, ctx) => {
            let session = ctx.driver.session();
            const cypherQuery = `MATCH (role:Role {id: "${roleId}"}) SET ` + field + `= "${value}" RETURN role LIMIT 1`;
            return await session.run(cypherQuery).then(
                result => {
                    const resData = result.records[0].get("role").properties;
                    return resData;
                }
            )
        },

        deleteRole: async (_, params, ctx) => {
            const {roleId} = params;
            let session = ctx.driver.session();
            const cypherQuery = `MATCH (role:Role{id:"${roleId}"}) DETACH DELETE role`;
            return await session.run(cypherQuery).then(
                result => {
                    return true;
                }
            )
        },
    }
};

export default resolvers;