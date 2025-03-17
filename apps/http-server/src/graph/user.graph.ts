import { graph } from "./graph";
import { InternalServerError} from "../utils/errors";

interface User{
    id:string
    name:string,
    username:string,
    password:string|null,
    email:string,
    dob:Date,
    image:string|null,
    mobile:string|null,
    bio:string|null,
    isVerified:boolean,
    createdAt:Date,
    updatedAt:Date
}

class UserGraph {

    async createUser(user: User) {
        const session = graph.getSession();
        try {

            const query = `
                MERGE (u:User {
                    name: $name,
                    id: $id,
                    username: $username,
                    ${user.password ? `password: $password,` : ''}
                    email: $email,
                    dob: $dob,
                    ${user.image ? 'image: $image,' : ''}
                    ${user.mobile ? 'mobile: $mobile,' : ''}
                    ${user.bio ? 'bio: $bio,' : ''}
                    isVerified: $isVerified,
                    createdAt: $createdAt,
                    updatedAt: $updatedAt
                }) RETURN u
            `;
            const result = await session.run(query, {
                id: user.id,
                name: user.name,
                username: user.username,
                password: user.password,
                email: user.email,
                dob: user.dob.toISOString(),
                image: user.image,
                mobile: user.mobile,
                bio: user.bio,
                isVerified: user.isVerified,
                createdAt: user.createdAt.toISOString(),
                updatedAt: user.updatedAt.toISOString()
            });
            console.log(result.records[0]?.get('u').properties);
            return result.records[0]?.get('u').properties;
        } catch (error) {
            console.error("Error in creating user", error);
            throw new InternalServerError("Error in creating user");
        }
        finally {
            await graph.closeSession(session);
        }
    }

    async updateUser(user:User){
        const session = graph.getSession();
        try{
            const query = `
                MATCH (u:User {id: $id})
                SET u += {
                    name: $name,
                    username: $username,
                    ${user.password ? `password: $password,` : ''}
                    email: $email,
                    dob: $dob,
                    ${user.image ? 'image: $image,' : ''}
                    ${user.mobile ? 'mobile: $mobile,' : ''}
                    ${user.bio ? 'bio: $bio,' : ''}
                    isVerified: $isVerified,
                    updatedAt: $updatedAt
                } RETURN u
            `;
            const result = await session.run(query, {
                id: user.id,
                name: user.name,
                username: user.username,
                password: user.password,
                email: user.email,
                dob: user.dob.toISOString(),
                image: user.image,
                mobile: user.mobile,
                bio: user.bio,
                isVerified: user.isVerified,
                updatedAt: user.updatedAt.toISOString()
            });
            return result.records[0]?.get('u').properties;
        }catch(error){
            console.error("Error in updating user", error);
            throw new InternalServerError("Error in updating user");
        }finally{
            await graph.closeSession(session);
        }
    }
}

export const userGraph = new UserGraph();

