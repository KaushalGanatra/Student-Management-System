import {Class, Division, Student } from '../structures/Types';
import axios, {AxiosResponse} from 'axios';
export const baseUrl = 'http://localhost:5027/api';

 export const fetchClasses = async () => {
    const classUrl = `${baseUrl}/class`;
    const classResponse: AxiosResponse<Class[]> = await axios.get(classUrl);
    return classResponse.data;
  };

  export const fetchDivisions = async () => {
    const divisionUrl = `${baseUrl}/division`;
    const divisionResponse: AxiosResponse<Division[]> = await axios.get(divisionUrl);
    return divisionResponse.data;
  };

  export const fetchStudents = async () => {
    const studentUrl = `${baseUrl}/student`;
    const studentResponse: AxiosResponse<Student[]> = await axios.get(studentUrl);
    return studentResponse.data;
  };