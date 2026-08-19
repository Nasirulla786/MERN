import jwt from "jsonwebtoken"

const generateToken =(id)=>{
    try {
        const token = jwt.sign({id} ,process.env.JWT_SECRET)
        if(!token){
            console.error("Token generation failed")
            return
        }
        return token

    } catch (error) {
        console.error("Token generate error",error)

    }
}


export default generateToken
