export class SurveyQuestion {
    SurveyQuestionId: number;
    SurveyId: number;
    SurveyPageId: number;
    Name: string;
    Description: string;
    SortOrder: number;
    ScaleTypeId: number;
    MatrixTypeId: number;
    ParentQuestionId: number = 0;
    IsRequire: boolean;
    IsMaxChoice: boolean;
    MaxChoice: number;
    IsOther: boolean;
    IsDeleted: boolean;
  //  ChildQuestion: SurveyQuestion[];
}