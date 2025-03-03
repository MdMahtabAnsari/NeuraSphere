import {z} from 'zod';

export const content = z.string({message:"content must be string"}).trim().max(1000,{message:"content must be at most 1000 characters long"}).optional();
export const media = z.array(z.object({
    // url must be a string, and it must be a valid url
    url: z.string({message:"url must be string"}).url({message:"url must be a valid url"}),
    // type must be a string, and it must be either "image" or "video"
    type: z.string({message:"type must be string"}).refine((value) => value === "image" || value === "video",{message:"type must be either 'image' or 'video'"})
}))
export const tags = z.array(z.string({message:"tags must be string"}).trim().max(50,{message:"tags must be at most 50 characters long"}));
export const id = z.string({message:"id must be string"}).uuid({message:"id must be a valid uuid"});
export const removeMedia = z.array(z.string({message:"removeMedia must be string"}).uuid({message:"removeMedia must be a valid uuid"}))
const username = z.string({message:"username must be string"}).trim().min(3,{message:"username must have at least 3 characters"}).max(20,{message:"username must have at most 20 characters"}).regex(/^[a-zA-Z0-9]*$/,{message:"username must have only alphanumeric characters"});
const email = z.string({message:"email must be string"}).trim().email({message:"email must be a valid email"});
const mobile = z.string({message:"mobile must be string"}).trim().regex(/^\d{10}$/, {message:"mobile must be a valid phone number"});
const userId = z.string({message:"userId must be string"}).uuid({message:"userId must be a valid uuid"});
const name = z.string({message:"name must be string"}).trim().max(50,{message:"name must be at most 50 characters long"});
export const identifier = z.union([
    username,
    userId,
    email,
    mobile,
    name


])

export const page = z.string({message:"page must be string"}).refine((value) => !isNaN(parseInt(value)) && parseInt(value)>0,{message:"page must be number and greater than 0"});
export const limit = z.string({message:"limit must be string"}).refine((value) => !isNaN(parseInt(value)) && parseInt(value)>0,{message:"limit must be number and greater than 0"});

export const createPost = z.object({
    // content must be a string, and it must be at most 1000 characters long
    content: content.optional(),
    // image/video must be array of objects and eact object have valid url and type
    media: media.optional(),
}).strip().refine((data) => data.content || data.media,{message:"content or media is required"});


export const tagsObject = z.object({
    // tags must be array of strings, and each string must be at most 50 characters long
    tags: tags
}).strip()

export const getPostByTags = z.object({
    // tags must be array of strings, and each string must be at most 50 characters long
    tags: tags,
    // page must be a number and greater than 0
    page: page.optional(),
    // limit must be a number and greater than 0
    limit: limit.optional(),
}).strip()

export const pageLimitObj = z.object({
    // page must be a number and greater than 0
    page: page.optional(),
    // limit must be a number and greater than 0
    limit: limit.optional(),
}).strip()

export const updatePost = z.object({
    // id must be a string, and it must be a valid uuid
    id: id,
    // content must be a string, and it must be at most 1000 characters long
    content: content.optional(),
    // image/video must be array of objects and eact object have valid url and type in add media
    addMedia: media.optional(),
    // image/video must be array of uuids in remove media
    removeMedia: removeMedia.optional(),
}).strip().refine((data) => data.content || data.addMedia || data.removeMedia,{message:"content or addMedia or removeMedia is required"});



export const idObject = z.object({
    // id must be a string, and it must be a valid uuid
    id: id
}).strip()


export const getPostByUsernamesAndUseridAndNameAndMobileAndEmail = z.object({
    // identifier must be either username or email or mobile or userId
    identifier: identifier,
    // page must be a number and greater than 0
    page: page.optional(),
    // limit must be a number and greater than 0
    limit: limit.optional(),
}).strip()





