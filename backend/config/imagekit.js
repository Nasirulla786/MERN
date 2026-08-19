import ImageKit from "@imagekit/nodejs"

const imageKit  = new ImageKit({
    privateKey:process.env.IMAGE_KIT_PRIVATE_KEY
})


export default imageKit
