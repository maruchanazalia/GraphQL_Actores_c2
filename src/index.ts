import 'dotenv/config'
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer} from '@apollo/server/standalone'
import { ActorQueryResolver, ActorMutationResolver } from "./resolvers/ActorsResolver";
import { UserQueryResolver, UserMutationResolver } from "./resolvers/UsersResolver";



const typeDefs= `

    type User {
        id: ID
        name: String
        username: String
        password: String
    }

    type Actor {
        id: ID
        name: String
        birthday: String
        movies: String
    }

    type Query {
        getAllUsers:[User]
        getUserByID(id: ID): User
        getAll(page: Int, limit: Int): [Actor]
        getById(id: ID): Actor
        getActorByName(name: String): Actor
        getActorByMovie(movie: String): Actor
        getActorsByMovieABC(page: Int, limit: Int): [Actor]
        
    }

    type Mutation {
        login(tel: String, password: String): String
        registerUser(name: String, username: String, password: String): User
        deleteUserByID(id: ID): MutationResponse
        createActor(name: String, birthday: String, movies: String): Actor
        deleteActor(id: ID): MutationResponse
        updateActor(id: ID, name: String, birthday: String, movies: String): MutationResponse
        deleteAllActors: MutationResponse
        deleteActorsByRange(startId: ID, endId: ID): MutationResponse
        createWebHoktype(urlApi:String,type:String):String
    }

    type MutationResponse {
        success: Boolean
        message: String
    }


`

const resolvers = {

    Query: {

        ...ActorQueryResolver,
        ...UserQueryResolver
    },

    Mutation: {

        ...UserMutationResolver,
        ...ActorMutationResolver
    }

    
}

const server = new ApolloServer({
    typeDefs, 
    resolvers,
});
const PORT = process.env.PORT ? Number.parseInt(process.env.PORT) : 3000;

(async () => {
    const {url} = await startStandaloneServer(server, {
        context: async ({req}) => {
            const {headers } = req
            return { headers }
        },
        listen: {port: PORT}
    }) 

    console.log('en mi cuarto corriendo en el puerto: '+ url)
})();