export interface TypeItemTopReviewer {
    id: string;
    creator: number;
    creatorName: string;
    creatorAvatar: string;
    description: string;
    reputation: number;
}

export interface TypeGetTopReviewerResponse {
    list: Array<TypeItemTopReviewer>;
    myIndex: number;
}
