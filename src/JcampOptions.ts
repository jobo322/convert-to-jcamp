export interface JcampInfo {
  /**
   * title of the file
   * @default ''
   */
  title?: string;
  /**
   * owner of the file
   * @default ''
   */
  owner?: string;
  /**
   * origin of the file
   * @default ''
   */
  origin?: string;
  /**
   * type of data
   * @default ''
   */
  dataType?: string;
  /**
   * units for the x axis
   * @default 'Combiation of label and units from variable'
   */
  xUnits?: string;
  /**
   * units for the y axis
   * @default 'Combiation of label and units from variable'
   */
  yUnits?: string;
  /**
   * factor to multiply X values
   * @default 1
   */
  xFactor?: number;
  /**
   * factor to multiply Y values
   * @default 1
   */
  yFactor?: number;
}

export interface JcampOptions {
  /**
   * standardize meta data defined in a jcamp like `title` or `dataType`
   * @default {}
   */
  info?: JcampInfo;
  /**
   * meta data information that will be placed in a ##$ labeled data record. Objects will be stringified.
   * @default {}
   */
  meta?: Record<string, any>;
  /**
   * force the ntuples format even if there is only x and y variables
   * @default false
   */
  forceNtuples?: boolean;
  /**
   * Use XYDATA format. Will use first / last X and equidistant Xs values if true
   * @default false
   */
  xydata?: boolean;
}
