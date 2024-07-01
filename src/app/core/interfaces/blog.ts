export interface Blog{
    title:string;
    tags:string[];
    blogImage:File;
    description:string;
    postingDate:Date;
    bloggerName?:string;
    BloggerImagePath?:string;
}