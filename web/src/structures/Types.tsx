import * as Yup from 'yup';

export type Student = {
    id?: string;
    name: string;
    class: string;
    division: string;
    gender: string;
};

export type Class = {
    id: string;
    classNumber: number;
}

export const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    class: Yup.number().required('Class is required').min(1, 'Class must be a positive number').max(12, 'Class number must be lower than 12'),
    division: Yup.string().required('Division is required'),
    gender: Yup.string().required('Gender is required'),
  });
  