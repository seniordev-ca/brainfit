export interface StepOptionProps {
  name: string;
}
export interface StepProps {
  id: string;
  header: string;
  description: string;
  primary?: boolean;
  isActive?: boolean;
  children?: StepProps[];
  options?: StepOptionProps[];
  nextStep?: string; // overrides nextStep function
}

// 'children' field can hold an array of sub-steps
export const steps: StepProps[] = [
  { id: 'home', header: 'Home', description: 'Welcome', isActive: true },
  { id: 'second', header: 'Second', description: 'Step 2' }
];

/**
 * get step row
 *
 * @param key
 * @returns StepProps
 */
export const getStepDetails = (id: string): StepProps | undefined =>
  steps.find((row: StepProps) => row.id === id);

/**
 * get parent of current row
 *
 * @param key
 * @returns StepProps
 */
export const getParent = (
  id: string | undefined,
  stepsFiltered: StepProps[]
): StepProps | undefined => {
  let result = stepsFiltered
    .filter((row) => row.children && row.children.length > 0)
    .find((row) => row.children?.find((child) => child.id === id));
  // if no result check for inner children
  if (!result) {
    stepsFiltered
      .filter((row) => row.children && row.children.length > 0)
      // eslint-disable-next-line consistent-return
      .some((row) => {
        result = row.children
          ?.filter((row2) => row2.children && row2.children.length > 0)
          .find((row2) => row2.children?.find((child) => child.id === id));
        if (result) return true;
        return false;
      });
  }
  return result;
};

export const nav = {
  /**
   * get step row
   *
   * @param key
   * @returns StepProps
   */
  getStepDetails: (
    id: string,
    stepsFiltered?: StepProps[]
  ): StepProps | undefined =>
    (stepsFiltered || steps).find((row: StepProps) => row.id === id)
};
