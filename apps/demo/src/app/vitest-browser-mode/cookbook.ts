export interface Cookbook {
  id: string;
  title: string;
  authors: string[];
  description: string;
  pictureUri?: string;
  previewUrl: string;
}

export function createCookbook(cookbook: Cookbook): Cookbook {
  return cookbook;
}
