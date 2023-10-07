export const formatProgramType = (programsData, program) =>
  programsData
    ?.find((el) => el.id === program)
    ?.programType?.map((el) => ({
      name: el.split('_').join(' '),
      value: el,
    })) || [];
