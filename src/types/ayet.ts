export interface AyetSurvey {
  id: number;
  cpi: number;
  cr: number;
  loi: number;
  category: string;
  category_icon_gif: string;
  category_icon_svg: string;
  is_new: boolean;
  missing_qualifications: number;
  remaining_completes: number;
  url: string;
}

export interface AyetProfiler {
  missing_profiler: boolean;
  missing_profiler_qualifications: number;
}

export interface AyetSurveywall {
  name: string;
  currency_name_singular: string;
  currency_name_plural: string;
  currency_sale: boolean;
  currency_sale_end: string | null;
  currency_sale_multiplier: number;
}

export interface AyetSurveywallResponse {
  status: string;
  surveys: AyetSurvey[];
  profiler: AyetProfiler;
  surveywall: AyetSurveywall;
}

export interface AyetSurveyOffer {
  id: string;
  surveyId: number;
  title: string;
  description: string;
  category: "surveys";
  provider: "ayeT";
  points: number;
  minutes: number;
  isNew: boolean;
  startUrl: string;
  iconSlug: string;
}

export interface AyetSurveysApiResponse {
  success: boolean;
  surveys?: AyetSurveyOffer[];
  profiler?: AyetProfiler;
  surveywall?: AyetSurveywall;
  error?: string;
}
