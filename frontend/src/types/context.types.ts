export type Context = {
  context_id: string;
  topic_id: string;
  context: string;
};

export type TopicImage = {
  context_id: string;   
  image_url: string;
  caption: string;
};

export type TopicImagesResponse = {
  topic_id: string;
  images: TopicImage[];  
};