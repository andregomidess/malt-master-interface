import { maltMasterApi } from '../../../shared/maltMasterApi'
import { User, UserInput } from '../interfaces/User'

const USERS_BASE_URL = '/users'

export const usersApi = {
  findById: async (id: string): Promise<User> => {
    const response = await maltMasterApi.get<User>(`${USERS_BASE_URL}/${id}`)
    return response.data
  },

  update: async (input: UserInput): Promise<User> => {
    const response = await maltMasterApi.put<User>(USERS_BASE_URL, input)
    return response.data
  },
}

