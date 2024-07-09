export interface Blog {
  id: number;
  title: string;
  tags: string[];
  blogImage: File;
  description: string;
  postingDate: Date;
  bloggerId: number;
  bloggerName: string;
  bloggerImagePath: string;
}
