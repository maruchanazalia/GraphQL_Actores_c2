import UserController from "../controllers/userController"

export const UserQueryResolver = {

        getAllUsers: UserController.getAllUsers,
        getUserByID: UserController.getUserByID
    
}

export const UserMutationResolver = {

        login: UserController.login,
        registerUser: UserController.registerUser,
        deleteUserByID: UserController.deleteUserByID,
        createWebHoktype:UserController.addWebHook
        

}