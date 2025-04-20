export interface articles{
    codart: string;
    desart: string;
    pcoart: string;
    imgart: string;
    famart: string;
    eanart: string;
}

export interface Category {
    id: number;
    name: string;
    image: string;
    fam: string[];
  }
  export interface ArticlesResponse {
    articles: articles[];
    measures: string[];
  }