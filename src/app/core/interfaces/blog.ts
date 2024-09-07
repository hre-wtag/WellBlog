export interface Blog {
  id: number;
  title: string;
  tags: string[];
  blogImage: File | string;
  description: string;
  postingDate: Date | string;
  bloggerId: number;
  bloggerName: string;
  bloggerImage: File | string;
}
