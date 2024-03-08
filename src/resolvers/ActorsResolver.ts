import ActorController from "../controllers/actorController";

    export const ActorQueryResolver = {
        
        getAll: ActorController.getAllActors,
        getById: ActorController.getActorByID,
        getActorByName: ActorController.getActorByName,
        getActorByMovie: ActorController.getActorByMovie,
        getActorsByMovieABC: ActorController.getActorsByMovieABC
    }

    export const ActorMutationResolver = {
        createActor: ActorController.createActor,
        deleteActor: ActorController.deleteActor,
        updateActor: ActorController.updateActor,
        deleteAllActors: ActorController.deleteAllActors,
        deleteActorsByRange: ActorController.deleteActorsByRange
        

    }