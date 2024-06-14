const sessionIdToUseMap= new Map();

const setUser= (id,user)=>{
    sessionIdToUseMap.set(id, user)
}

const getUser= (id)=>{
    return sessionIdToUseMap.get(id);
}

module.exports={
    setUser,
    getUser,
}