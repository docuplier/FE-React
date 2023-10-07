import { ReceiversType } from './constants';

export const getReceiversList = (data) => {
  const { courses, faculties, departments } = data;

  const newCourseArray = courses?.map((course) => ({
    id: course.id,
    name: course.title,
    type: ReceiversType.COURSE,
  }));

  const newFacultiesArray = faculties?.map((faculty) => ({
    id: faculty.id,
    name: faculty.name,
    type: ReceiversType.FACULTY,
  }));

  const newDepartmentsArray = departments?.map((department) => ({
    id: department.id,
    name: department.name,
    type: ReceiversType.DEPARTMENT,
  }));

  const transformData = (dataArray) => {
    const dataObj = {};

    dataArray.forEach((element) => {
      dataObj[element.id] = element;
    });
    return dataObj;
  };

  return transformData([...newCourseArray, ...newDepartmentsArray, ...newFacultiesArray]);
};
