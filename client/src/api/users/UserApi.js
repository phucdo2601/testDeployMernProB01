import { basicCallApi } from "../baseUrl";

const getOwnerContactInfo = async (id) => {
    return await basicCallApi().get(`user/getContactInfo/${id}`);
}

const UserApi = {
    getOwnerContactInfo,
};

export default UserApi;